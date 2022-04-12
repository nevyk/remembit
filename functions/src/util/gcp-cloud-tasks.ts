import { CloudTasksClient } from '@google-cloud/tasks';
import { string } from 'yup';

// configs
const gcpProjectId = process.env.REMEMBIT_GCP_PROJECT_ID;
const gcpTasksQueueName = process.env.REMEMBIT_GCP_TASKS_QUEUE;
const gcpTasksRegion = process.env.REMEMBIT_GCP_TASKS_REGION;
const gcpTasksServiceAccount = process.env.REMEMBIT_GCP_TASKS_SERVICE_ACCOUNT_EMAIL;
const firebaseProjectId = process.env.REMEMBIT_FIREBASE_PROJECT_ID;
const firebaseFunctionRegion = process.env.REMEMBIT_FIREBASE_FUNCTIONS_REGION;

// configure client and queue
const tasksClient = new CloudTasksClient();
const queuePath = tasksClient.queuePath(
  gcpProjectId as string,
  gcpTasksRegion as string,
  gcpTasksQueueName as string
);

function scheduleEventHistoryCleanupTask(eventId: string) {
  const url = `https://${firebaseFunctionRegion}-${firebaseProjectId}.cloudfunctions.net/cleanup-eventHistory`;
  const query = `?eventid=${eventId}`;

  const request = {
    parent: queuePath,
    task: {
      httpRequest: {
        httpMethod: 5, // this is the enum or 'DELETE'
        url: `${url}${query}`,
        oidcToken: {
          serviceAccountEmail: gcpTasksServiceAccount,
          audience: url,
        },
      },
      scheduleTime: {
        seconds: 90000 + Date.now() / 1000, // keep event for 25 hours
      },
    },
  };

  return tasksClient.createTask(request);
}

function scheduleBookmarksCleanup(uid: string) {
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
  return tasksClient.createTask(request);
}

export { scheduleBookmarksCleanup, scheduleEventHistoryCleanupTask };
