import functions from 'firebase-functions';
import admin from 'firebase-admin';
import pick from 'just-pick';
import isEmpty from 'just-is-empty';

// handle firebase admin sdk
try {
  admin.initializeApp();
} catch (err) {
  /* tslint:disable:no-empty */
}

// db references
const usersDb = admin.firestore().collection('users');

const onCreate = functions.firestore
  .document('bookmarks/{bookmarkId}')
  .onCreate(async (snapshot, context) => {
    // get existing data
    const bookmark = await snapshot.ref.get();
    const bookmarkData = bookmark.data();
    let bookmarkTimestamps = {};

    // check if bookmark document exists
    if (bookmarkData) {
      bookmarkTimestamps = pick(bookmarkData, ['created', 'updated']);

      // check if bookmark already has timestamps; if not, add them
      if (!isEmpty(bookmarkTimestamps)) {
        return true;
      } else {
        // add timestamps to bookmark
        functions.logger.info('adding timestamps to new bookmark.');
        await snapshot.ref.update({
          created: context.timestamp,
          updated: context.timestamp,
        });

        // increment user's bookmark count
        functions.logger.info('updating bookmark count of user.');
        return usersDb.doc(snapshot.data().owner).update({
          bookmarksTotal: admin.firestore.FieldValue.increment(1),
        });
      }
    } else {
      functions.logger.error('create bookmark event has no document data');
      return false;
    }
  });

export { onCreate };
