import functions from 'firebase-functions';
import admin from 'firebase-admin';
import { scheduleBookmarksCleanup } from '../util/gcp-cloud-tasks.js';

// handle firebase admin sdk
try {
  admin.initializeApp();
} catch (err) {
  /* tslint:disable:no-empty */
}

// db references
const bookmarksDb = admin.firestore().collection('bookmarks');

// construct config for cloud tasks
const cloudTasksConfig = {
  gcpProject: process.env.REMEMBIT_GCP_PROJECT_ID as string,
  gcpLocation: process.env.REMEMBIT_GCP_TASKS_REGION as string,
  gcpQueue: process.env.REMEMBIT_GCP_TASKS_QUEUE as string,
  gcpServiceAccount: process.env.REMEMBIT_GCP_TASKS_SERVICE_ACCOUNT_EMAIL as string,
  firebaseLocation: process.env.REMEMBIT_FIREBASE_FUNCTIONS_REGION as string,
  firebaseProject: process.env.REMEMBIT_FIREBASE_PROJECT_ID as string,
};

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
          // create task
          try {
            functions.logger.info(`scheduling cleanup of bookmarks for ${uid}`);
            await scheduleBookmarksCleanup(uid, cloudTasksConfig);
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
