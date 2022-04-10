import functions from 'firebase-functions';
import admin from 'firebase-admin';
import { CloudTasksClient } from '@google-cloud/tasks';

// handle firebase admin sdk
try {
  admin.initializeApp();
} catch (err) {
  /* tslint:disable:no-empty */
}

// configs
const gcpProjectId = process.env.REMEMBIT_GCP_PROJECT_ID;
const gcpTasksQueueName = process.env.REMEMBIT_GCP_TASKS_QUEUE;
const gcpTasksRegion = process.env.REMEMBIT_GCP_TASKS_REGION;
const gcpTasksServiceAccount = process.env.REMEMBIT_GCP_TASKS_SERVICE_ACCOUNT_EMAIL;
const firebaseProjectId = process.env.REMEMBIT_FIREBASE_PROJECT_ID;
const firebaseFunctionRegion = process.env.REMEMBIT_FIREBASE_FUNCTIONS_REGION;

// db references
const bookmarksDb = admin.firestore().collection('bookmarks');

const bookmarks = functions.https.onRequest(async (request, response) => {
  // only run on DELETE methods
  if (request.method !== 'DELETE') {
    functions.logger.info('wrong http method, exiting');
    response.status(403).send("Ah Ah Ah Ah, you didn't say the magic word.");
  } else {
    // get uid
    const uid = request.query.uid;

    // handle bookmarks cleanup
    if (typeof uid === 'string') {
      const snapshot = await bookmarksDb.where('owner', '==', uid).limit(100).get();

      // process bookmarks
      if (snapshot.empty) {
        // exit if there are no bookmarks to clean up
        response.status(200).send();
      } else {
        // check if rerun is needed
        const rerun = snapshot.size === 100 ? true : false;

        // delete bookmarks
        for (let b = 0; b < snapshot.size; b++) {
          await snapshot.docs[b].ref.delete();
        }

        // schedule another run if necessary
        if (rerun) {
          // configure CloudTasks client
          const tasksClient = new CloudTasksClient();
          const queuePath = tasksClient.queuePath(
            gcpProjectId as string,
            gcpTasksRegion as string,
            gcpTasksQueueName as string
          );

          // create function call
          const url = `https://${firebaseFunctionRegion}-${firebaseProjectId}.cloudfunctions.net/cleanup-bookmarks`;
          const query = `?uid=${uid}`;

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
          try {
            await tasksClient.createTask(request);
            response.status(200).send();
          } catch (error) {
            functions.logger.error(error);
            response.status(500).send();
          }
        }
      }
    } else {
      response.status(400).send('uid must be a string');
    }
  }
});

export { bookmarks };
