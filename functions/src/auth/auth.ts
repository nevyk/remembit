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
    console.log('creating user document');
    await users.doc(user.uid).create({
      bookmarksTotal: 0,
    });
  } catch (err) {
    console.log(err);
  }
});

const onDelete = functions.auth.user().onDelete((user) => {
  // delete user document
  console.log('deleting user document');
  return users.doc(user.uid).delete();
});

export { onCreate, onDelete };
