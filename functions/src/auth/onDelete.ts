import functions from 'firebase-functions';
import admin from 'firebase-admin';
import { isRunningInEmulator } from '../util/util.js';
import { CloudTasksClient } from '@google-cloud/tasks';

// handle firebase admin sdk
try {
  admin.initializeApp();
} catch (err) {
  /* tslint:disable:no-empty */
}

// db references
const usersDb = admin.firestore().collection('users');

// configs
const gcpProjectId = process.env.REMEMBIT_GCP_PROJECT_ID;
const gcpTasksQueueName = process.env.REMEMBIT_GCP_TASKS_QUEUE;
const gcpTasksRegion = process.env.REMEMBIT_GCP_TASKS_REGION;
const gcpTasksServiceAccount = process.env.REMEMBIT_GCP_TASKS_SERVICE_ACCOUNT_EMAIL;
const firebaseProjectId = process.env.REMEMBIT_FIREBASE_PROJECT_ID;
const firebaseFunctionRegion = process.env.REMEMBIT_FIREBASE_FUNCTIONS_REGION;

const onDelete = functions.auth.user().onDelete(async (user) => {
  // delete user document
  functions.logger.info('deleting user document');
  await usersDb.doc(user.uid).delete();

  // schedule cleanup of bookmarks
  if (!isRunningInEmulator()) {
    functions.logger.log(`scheduling cleanup of bookmarks for user: ${user.uid}`);

    // configure CloudTasks client
    const tasksClient = new CloudTasksClient();
    const queuePath = tasksClient.queuePath(
      gcpProjectId as string,
      gcpTasksRegion as string,
      gcpTasksQueueName as string
    );

    // create function call
    const url = `https://${firebaseFunctionRegion}-${firebaseProjectId}.cloudfunctions.net/cleanup-bookmarks`;
    const query = `?uid=${user.uid}`;

    // create task
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
        seconds: 5 + Date.now() / 1000,
      },
    };

    // create request
    const request = {
      parent: queuePath,
      task: task,
    };

    // create task
    return tasksClient.createTask(request);
  } else {
    return true;
  }
});

export { onDelete };
