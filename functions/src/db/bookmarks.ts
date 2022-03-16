import functions from 'firebase-functions';
import admin from 'firebase-admin';
import pick from 'just-pick';
import isEmpty from 'just-is-empty';
//@ts-ignore
import compare from 'just-compare';
import { recordEvent, isDuplicateEvent } from './utils.js';

// handle firebase admin sdk
try {
  admin.initializeApp();
} catch (err) {
  /* tslint:disable:no-empty */
}

// db references
const users = admin.firestore().collection('users');

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
        console.log('bookmark already has timestamps, exiting.');
        return true;
      } else {
        // add timestamps to bookmark
        console.log('adding timestamps to new bookmark.');
        await snapshot.ref.update({
          created: context.timestamp,
          updated: context.timestamp,
        });

        // increment user's bookmark count
        console.log('updating bookmark count of user.');
        // @ts-ignore
        return users.doc(snapshot.data().owner).update({
          bookmarksTotal: admin.firestore.FieldValue.increment(1),
        });
      }
    } else {
      console.error('create bookmark event has no document data');
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
    console.log('checking if bookmark data has changed.');
    if (compare(before, after)) {
      console.log('no changes, exiting.');
      return true;
    } else {
      console.log('bookmark data changed, updating timestamp.');
      return change.after.ref.update({
        updated: context.timestamp,
      });
    }
  });

const onDelete = functions.firestore
  .document('bookmarks/{bookmarkId}')
  .onDelete(async (snapshot, context) => {
    //
    // const tasksClient = new CloudTasksClient.CloudTasksClient();
    // const config = JSON.parse(process.env.FIREBASE_CONFIG);
    // const projectId = JSON.parse(process.env.FIREBASE_CONFIG).projectId;
    // const location = 'us-east4';
    // const queue = projectId;

    // get documents
    const bookmark = await snapshot.ref.get();

    // check if event already happened
    if (await isDuplicateEvent(context.eventId)) {
      console.log('event has already occurred, exiting.');
      return true;
    } else {
      // check if bookmark has been deleted
      if (!bookmark.exists) {
        // decrement user's bookmark count
        console.log('updating user bookmark count');
        await users.doc(snapshot.data().owner).update({
          bookmarksTotal: admin.firestore.FieldValue.increment(-1),
        });

        // record event in case duplicate delivery
        console.log('recording event in case of duplicate delivery.');
        return await recordEvent(context);
      }
    }
  });

export { onCreate, onUpdate, onDelete };
