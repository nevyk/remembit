import functions from 'firebase-functions';
import admin from 'firebase-admin';
import pick from 'just-pick';
import isEmpty from 'just-is-empty';
//@ts-ignore
import compare from 'just-compare';
import { recordEvent, isDuplicateEvent } from './dbutils.js';
import { isRunningInEmulator } from '../util/util.js';
import { CloudTasksClient } from '@google-cloud/tasks';

// handle firebase admin sdk
try {
  admin.initializeApp();
} catch (err) {
  /* tslint:disable:no-empty */
}

// db references
const users = admin.firestore().collection('users');

// configs
const gcpProjectId = process.env.REMEMBIT_GCP_PROJECT_ID;
const gcpTasksQueueName = process.env.REMEMBIT_GCP_TASKS_QUEUE;
const gcpTasksRegion = process.env.REMEMBIT_GCP_TASKS_REGION;
const gcpTasksServiceAccount = process.env.REMEMBIT_GCP_TASKS_SERVICE_ACCOUNT_EMAIL;
const firebaseProjectId = process.env.REMEMBIT_FIREBASE_PROJECT_ID;
const firebaseFunctionRegion = process.env.REMEMBIT_FIREBASE_FUNCTIONS_REGION;

// handlers
const onCreate = functions.firestore
  .document('bookmarks/{bookmarkId}')
  .onCreate(async (snapshot, context) => {
    // get existing data
    const bookmark = await snapshot.ref.get();
    const bookmarkData = bookmark.data();
    let bookmarkTimestamps = {};

    // check if bookmark document exists
    if (bookmarkData) {
      bookmarkTimestamps = pick(bookmarkData, ['created', 'updated']);

      // check if bookmark already has timestamps; if not, add them
      if (!isEmpty(bookmarkTimestamps)) {
        functions.logger.info('bookmark already has timestamps, exiting.');
        return true;
      } else {
        // add timestamps to bookmark
        functions.logger.info('adding timestamps to new bookmark.');
        await snapshot.ref.update({
          created: context.timestamp,
          updated: context.timestamp,
        });

        // increment user's bookmark count
        functions.logger.info('updating bookmark count of user.');
        // @ts-ignore
        return users.doc(snapshot.data().owner).update({
          bookmarksTotal: admin.firestore.FieldValue.increment(1),
        });
      }
    } else {
      functions.logger.error('create bookmark eventP has no document data');
      return false;
    }
  });

const onUpdate = functions.firestore
  .document('bookmarks/{bookmarkId}')
  .onUpdate(async (change, context) => {
    // get comparison data
    const before = pick(change.before.data(), ['name', 'url', 'tags']);
    const after = pick(change.after.data(), ['name', 'url', 'tags']);

    // check if bookmark has changed
    functions.logger.info('checking if bookmark data has changed.');
    if (compare(before, after)) {
      functions.logger.info('no changes, exiting.');
      return true;
    } else {
      functions.logger.info('bookmark data changed, updating timestamp.');
      return change.after.ref.update({
        updated: context.timestamp,
      });
    }
  });

const onDelete = functions.firestore
  .document('bookmarks/{bookmarkId}')
  .onDelete(async (snapshot, context) => {
    // get documents
    const bookmark = await snapshot.ref.get();

    // check if event already happened
    if (await isDuplicateEvent(context.eventId)) {
      functions.logger.info('event has already occurred, exiting.');
      return true;
    } else {
      // check if bookmark has been deleted
      if (!bookmark.exists) {
        try {
          // decrement user's bookmark count
          functions.logger.info('updating user bookmark count');
          await users.doc(snapshot.data().owner).update({
            bookmarksTotal: admin.firestore.FieldValue.increment(-1),
          });
        } catch (error: any) {
          if (error.code !== 5) {
            functions.logger.error(error);
          }
        }

        // record event in case duplicate delivery
        functions.logger.info('recording event in case of duplicate delivery.');
        await recordEvent(context);
      }
    }

    if (!isRunningInEmulator()) {
      // schedule task to clean up event from history
      functions.logger.info('scheduling delete event cleanup task');
      const tasksClient = new CloudTasksClient();
      const queuePath = tasksClient.queuePath(
        gcpProjectId as string,
        gcpTasksRegion as string,
        gcpTasksQueueName as string
      );

      const url = `https://${firebaseFunctionRegion}-${firebaseProjectId}.cloudfunctions.net/eventHistory-deleteEvent`;
      const query = `?eventid=${context.eventId}`;

      const task = {
        httpRequest: {
          httpMethod: 5, // this is the enum or 'DELETE'
          url: `${url}${query}`,
          oidcToken: {
            serviceAccountEmail: gcpTasksServiceAccount,
            audience: url,
          },
        },
        scheduleTime: {
          seconds: 90000 + Date.now() / 1000,
        },
      };

      const request = {
        parent: queuePath,
        task: task,
      };

      return tasksClient.createTask(request);
    } else {
      return true;
    }
  });

export { onCreate, onUpdate, onDelete };
