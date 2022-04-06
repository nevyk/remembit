import functions from 'firebase-functions';
import admin from 'firebase-admin';

// handle firebase admin sdk
try {
  admin.initializeApp();
} catch (err) {
  /* tslint:disable:no-empty */
}

// db references
const users = admin.firestore().collection('users');

// event handlers
const onCreate = functions.auth.user().onCreate(async (user) => {
  try {
    // create user document
    functions.logger.info('creating user document');
    await users.doc(user.uid).create({
      bookmarksTotal: 0,
    });
  } catch (err) {
    functions.logger.error(err);
  }
});

const onDelete = functions.auth.user().onDelete((user) => {
  // delete user document
  functions.logger.info('deleting user document');
  return users.doc(user.uid).delete();
});

export { onCreate, onDelete };
