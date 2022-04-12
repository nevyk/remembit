import functions from 'firebase-functions';
import admin from 'firebase-admin';
import { recordEvent, isDuplicateEvent } from './dbutils.js';
import { isRunningInEmulator } from '../util/util.js';
import { scheduleEventHistoryCleanupTask } from '../util/gcp-cloud-tasks.js';

// handle firebase admin sdk
try {
  admin.initializeApp();
} catch (err) {
  /* tslint:disable:no-empty */
}

// db references
const usersDb = admin.firestore().collection('users');

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
          await usersDb.doc(snapshot.data().owner).update({
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
      return scheduleEventHistoryCleanupTask(context.eventId);
    } else {
      return true;
    }
  });

export { onDelete };
