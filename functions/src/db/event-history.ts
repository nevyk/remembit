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
    console.log('wrong http method, exiting');
    res.status(403).send("Ah Ah Ah Ah, you didn't say the magic word.");
  } else {
    const eventId = req.body.eventId;
    console.log(req.body);

    event_history
      .doc(eventId)
      .delete()
      .then(() => {
        console.log(`sucessfully deleted event: ${eventId}`);
        res.status(200).send('successfully deleted event.');
      })
      .catch((e) => {
        console.log(`failed to delete event: ${eventId}`);
        console.log(e);
        res.status(500).send('failed to delete event.');
      });
  }
});

export { deleteEvent };
