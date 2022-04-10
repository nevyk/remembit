import admin from 'firebase-admin';
import * as bookmarks from './db/bookmarks.js';
import * as eventHistory from './db/event-history.js';
import * as auth from './auth/auth.js';
import * as cleanup from './cleanup/cleanup.js';

// handle firebase admin sdk
try {
  admin.initializeApp();
} catch (err) {
  /* tslint:disable:no-empty */
}

export { auth, bookmarks, eventHistory, cleanup };
