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

// construct config for cloud tasks
const cloudTasksConfig = {
  gcpProject: process.env.REMEMBIT_GCP_PROJECT_ID as string,
  gcpLocation: process.env.REMEMBIT_GCP_TASKS_REGION as string,
  gcpQueue: process.env.REMEMBIT_GCP_TASKS_QUEUE as string,
  gcpServiceAccount: process.env.REMEMBIT_GCP_TASKS_SERVICE_ACCOUNT_EMAIL as string,
  firebaseLocation: process.env.REMEMBIT_FIREBASE_FUNCTIONS_REGION as string,
  firebaseProject: process.env.REMEMBIT_FIREBASE_PROJECT_ID as string,
};

const onDelete = functions.auth.user().onDelete(async (user) => {
  // delete user document
  functions.logger.info('deleting user document');
  await usersDb.doc(user.uid).delete();

  // schedule cleanup of bookmarks
  if (!isRunningInEmulator()) {
    functions.logger.log(`scheduling cleanup of bookmarks for user: ${user.uid}`);

    return scheduleBookmarksCleanup(user.uid, cloudTasksConfig);
  } else {
    return true;
  }
});

export { onDelete };
