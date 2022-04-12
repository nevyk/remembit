import functions from 'firebase-functions';
import admin from 'firebase-admin';
import { isRunningInEmulator } from '../util/util.js';
import { scheduleBookmarksCleanup } from '../util/gcp-cloud-tasks.js';

// handle firebase admin sdk
try {
  admin.initializeApp();
} catch (err) {
  /* tslint:disable:no-empty */
}

// db references
const usersDb = admin.firestore().collection('users');

const onDelete = functions.auth.user().onDelete(async (user) => {
  // delete user document
  functions.logger.info('deleting user document');
  await usersDb.doc(user.uid).delete();

  // schedule cleanup of bookmarks
  if (!isRunningInEmulator()) {
    functions.logger.log(`scheduling cleanup of bookmarks for user: ${user.uid}`);

    return scheduleBookmarksCleanup(user.uid);
  } else {
    return true;
  }
});

export { onDelete };
