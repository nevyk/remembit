import functions from 'firebase-functions';
import admin from 'firebase-admin';

// handle firebase admin sdk
try {
  admin.initializeApp();
} catch (err) {
  /* tslint:disable:no-empty */
}

// db references
const event_history = admin.firestore().collection('event_history');

// functions
const deleteEvent = functions.https.onRequest((req, res) => {
  // only run on delete requests
  if (req.method !== 'DELETE') {
    functions.logger.info('wrong http method, exiting');
    res.status(403).send("Ah Ah Ah Ah, you didn't say the magic word.");
  } else {
    // parse request
    const eventId = req.query.eventid;

    // delete event from history table
    if (typeof eventId === 'string') {
      event_history
        .doc(eventId)
        .delete()
        .then(() => {
          functions.logger.info(`sucessfully deleted event: ${eventId}`);
          res.status(200).send('successfully deleted event.');
        })
        .catch((e) => {
          functions.logger.error(`failed to delete event: ${eventId}`);
          functions.logger.error(e);
          res.status(500).send('failed to delete event.');
        });
    } else {
      res.status(400).send('invalid eventid, must be string');
    }
  }
});

export { deleteEvent };
