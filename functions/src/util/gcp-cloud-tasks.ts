import { CloudTasksClient } from '@google-cloud/tasks';
import { logger } from 'firebase-functions';
// config
interface taskconfig {
  gcpProject: string;
  gcpLocation: string;
  gcpQueue: string;
  gcpServiceAccount: string;
  firebaseProject: string;
  firebaseLocation: string;
}

// configure client and queue
const tasksClient = new CloudTasksClient();

function scheduleEventHistoryCleanupTask(eventId: string, config: taskconfig) {
  const url = `https://${config.firebaseLocation}-${config.firebaseProject}.cloudfunctions.net/cleanup-eventHistory`;
  const query = `?eventid=${eventId}`;
  const parent = tasksClient.queuePath(
    config.gcpProject,
    config.gcpLocation,
    config.gcpQueue
  );

  const delay = Math.round(90000 + Date.now() / 1000); // 25 hours

  const request = {
    parent: parent,
    task: {
      httpRequest: {
        httpMethod: 5, // this is the enum or 'DELETE'
        url: `${url}${query}`,
        oidcToken: {
          serviceAccountEmail: config.gcpServiceAccount,
          audience: url,
        },
      },
      scheduleTime: {
        seconds: delay,
      },
    },
  };

  logger.info(JSON.stringify(request));
  return tasksClient.createTask(request);
}

function scheduleBookmarksCleanup(uid: string, config: taskconfig) {
  // create function call
  const url = `https://${config.firebaseLocation}-${config.firebaseProject}.cloudfunctions.net/cleanup-bookmarks`;
  const query = `?uid=${uid}`;
  const parent = tasksClient.queuePath(
    config.gcpProject,
    config.gcpLocation,
    config.gcpQueue
  );

  const delay = Math.round(5 + Date.now() / 1000);

  // create task
  const task = {
    httpRequest: {
      httpMethod: 5, // this is the enum or 'DELETE'
      url: `${url}${query}`,
      oidcToken: {
        serviceAccountEmail: config.gcpServiceAccount,
        audience: url,
      },
    },
    scheduleTime: {
      seconds: delay,
    },
  };

  // create request
  const request = {
    parent: parent,
    task: task,
  };

  // create task
  return tasksClient.createTask(request);
}

export { scheduleBookmarksCleanup, scheduleEventHistoryCleanupTask };
