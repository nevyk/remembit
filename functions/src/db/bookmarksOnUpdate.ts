import functions from 'firebase-functions';
import pick from 'just-pick';
//@ts-ignore
import compare from 'just-compare';

const onUpdate = functions.firestore
  .document('bookmarks/{bookmarkId}')
  .onUpdate(async (change, context) => {
    // get comparison data
    const before = pick(change.before.data(), ['name', 'url', 'tags']);
    const after = pick(change.after.data(), ['name', 'url', 'tags']);

    // check if bookmark has changed
    if (compare(before, after)) {
      functions.logger.info('no changes, exiting.');
      return true;
    } else {
      functions.logger.info('bookmark data changed, updating timestamp.');
      return change.after.ref.update({
        updated: context.timestamp,
      });
    }
  });

export { onUpdate };
