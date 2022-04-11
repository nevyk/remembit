import functions from 'firebase-functions';
import admin from 'firebase-admin';

// handle firebase admin sdk
try {
  admin.initializeApp();
} catch (err) {
  /* tslint:disable:no-empty */
}

// db references
const usersDb = admin.firestore().collection('users');

const onCreate = functions.auth.user().onCreate(async (user) => {
  try {
    // create user document
    functions.logger.info(`creating document for user: ${user.uid}`);
    await usersDb.doc(user.uid).create({
      bookmarksTotal: 0,
    });
  } catch (err) {
    functions.logger.error(err);
  }
});

export { onCreate };
