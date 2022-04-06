import admin from 'firebase-admin';
import { EventContext } from 'firebase-functions/v1';
import pick from 'just-pick';

// handle firebase admin sdk
try {
  admin.initializeApp();
} catch (err) {
  /* tslint:disable:no-empty */
}

// db references
const event_history = admin.firestore().collection('event_history');

const recordEvent = async function (context: EventContext) {
  const event = pick(context, ['eventId', 'timestamp']);

  await event_history.doc(context.eventId).set(event);
};

const isDuplicateEvent = async function (eventId: string) {
  const eventDoc = await event_history.doc(eventId).get();

  return eventDoc.exists;
};

export { isDuplicateEvent, recordEvent };
