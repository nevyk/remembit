import admin from 'firebase-admin';
import { EventContext } from 'firebase-functions/v1';
import pick from 'just-pick';

// interfaces
// interface CloudTasksConfig {
//   projectId: string;
//   location: string;
//   queue: string;
// }

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

// const scheduleEventCleanup = async function (
//   cloudTasksConfig: CloudTasksConfig,
//   eventId: string
// ) {
//   // import module
//   //@ts-ignore
//   const v2beta3 = require('@google-cloud/tasks');

//   // init config
//   const tasksClient = new v2beta3.CloudTasksClient();
//   const projectId = cloudTasksConfig.projectId;
//   const location = cloudTasksConfig.location;
//   const queue = cloudTasksConfig.queue;
//   const event = eventId;
//   const url = 'https://url.remembit.app';

//   // create fully qualified queue name
//   const parent = tasksClient.queuePath(projectId, location, queue);

//   // create task definition
//   const task = {
//     name: `delete-${event}`,
//     scheduleTime: {
//       seconds: 90000 + Date.now() / 1000,
//     },
//     httpRequest: {
//       httpMethod: 'DELETE',
//       url: url,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: Buffer.from(
//         JSON.stringify({
//           eventId: eventId,
//         })
//       ),
//     },
//   };

//   // submit task
//   try {
//     const response = await tasksClient.createTask({ parent, task });
//     console.log(`Created task ${response.name}`);
//     return response.name;
//   } catch (err) {
//     console.error(Error(err.message));
//   }
// };

export { isDuplicateEvent, recordEvent };
