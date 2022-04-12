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
            await scheduleBookmarksCleanup(uid);
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
