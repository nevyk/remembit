import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing';
import {
  setDoc,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { describe, test } from '@jest/globals';

interface ValidBookmark {
  owner: string;
  name: string;
  url: string;
  tags: Array<string>;
}

async function getTestEnv() {
  return initializeTestEnvironment({
    projectId: 'remembit-stg'
  });
}

describe('Anonymous User', () => {
  test('Cannot create bookmark', async () => {
    const testEnv = await getTestEnv();
    const anon = testEnv.unauthenticatedContext();
    const docRef = anon.firestore().doc('/bookmarks/anonTestCreate');

    const document: ValidBookmark = {
      owner: 'anon',
      name: 'TestCreateDoc',
      url: 'https://github.com',
      tags: ['tag1']
    };

    await assertFails(setDoc(docRef, document));
  });

  test('Cannot read bookmarks', async () => {
    const testEnv = await getTestEnv();
    const anon = testEnv.unauthenticatedContext();
    const bookmarksDb = collection(anon.firestore(), 'bookmarks');
    const bookmrksQuery = query(bookmarksDb, where('owner', '==', 'spidey'));

    await assertFails(getDocs(bookmrksQuery));
  });

  test('Cannot update bookmarks', async () => {
    const testEnv = await getTestEnv();
    const anon = testEnv.unauthenticatedContext();
    const spidey = testEnv.authenticatedContext('spidey');
    const spideyBookmarksDb = collection(spidey.firestore(), 'bookmarks');

    const spideyValidBookmark: ValidBookmark = {
      owner: 'spidey',
      name: 'github',
      url: 'https://github.com',
      tags: ['code']
    };

    // create bookmark for authenticated user
    const spideyBookmark = await addDoc(spideyBookmarksDb, spideyValidBookmark);

    // attempt to update with anon user
    const docRef = doc(anon.firestore(), spideyBookmark.path);

    await assertFails(
      updateDoc(docRef, {
        owner: 'spidey',
        name: 'github2',
        url: 'https://github.com',
        tags: ['code']
      })
    );

    await assertFails(
      updateDoc(docRef, {
        owner: 'anon',
        name: 'github',
        url: 'https://github.com',
        tags: ['code']
      })
    );
  });

  test('Cannot delete bookmarks', async () => {
    const testEnv = await getTestEnv();
    const anon = testEnv.unauthenticatedContext();
    const anonBookmarksDb = collection(anon.firestore(), 'bookmarks');

    // attempt to delete as anon
    await assertFails(deleteDoc(doc(anonBookmarksDb, 'anonTestDelete')));
  });
});

describe('Authorized User', () => {
  test('Can create bookmark', async () => {
    const testEnv = await getTestEnv();
    const spidey = testEnv.authenticatedContext('spidey');
    const spideyBookmarksDb = collection(spidey.firestore(), 'bookmarks');

    const document: ValidBookmark = {
      owner: 'spidey',
      name: 'TestCreateDoc',
      url: 'https://github.com',
      tags: ['code']
    };

    await assertSucceeds(addDoc(spideyBookmarksDb, document));
  });

  test('Can read bookmarks', async () => {
    const testEnv = await getTestEnv();
    const spidey = testEnv.authenticatedContext('spidey');
    const spideyBookmarksDb = collection(spidey.firestore(), 'bookmarks');
    const bookmarksQuery = query(spideyBookmarksDb, where('owner', '==', 'spidey'));

    await assertSucceeds(getDocs(bookmarksQuery));
  });

  test('Can update bookmark', async () => {
    const testEnv = await getTestEnv();
    const spidey = testEnv.authenticatedContext('spidey');
    const spideyBookmarksDb = collection(spidey.firestore(), 'bookmarks');

    const bookmarkData = {
      owner: 'spidey',
      name: 'GitHub',
      url: 'https://github.com',
      tags: ['tag1']
    };

    const bookmarkDataUpdate = {
      name: 'GitHub2',
      url: 'https://github.com',
      tags: ['tag1']
    };

    // create bookmark
    const bookmarkRef = await addDoc(spideyBookmarksDb, bookmarkData);

    // update bookmark
    await assertSucceeds(updateDoc(bookmarkRef, bookmarkDataUpdate));
  });

  test('Can delete bookmark', async () => {
    const testEnv = await getTestEnv();
    const spidey = testEnv.authenticatedContext('spidey');
    const spideyBookmarksDb = collection(spidey.firestore(), 'bookmarks');

    const bookmarkData = {
      owner: 'spidey',
      name: 'GitHub',
      url: 'https://github.com',
      tags: ['tag1']
    };

    // create bookmark
    const bookmarkRef = await addDoc(spideyBookmarksDb, bookmarkData);

    // delete bookmark
    await assertSucceeds(deleteDoc(bookmarkRef));
  });

  test('Cannot create bookmark with invalid data types', async () => {
    const testEnv = await getTestEnv();
    const spidey = testEnv.authenticatedContext('spidey');
    const spideyBookmarksDb = collection(spidey.firestore(), 'bookmarks');

    const bookmark = {
      owner: 1234,
      name: 1234,
      url: 1234,
      tags: 'string'
    };

    await assertFails(addDoc(spideyBookmarksDb, bookmark));
  });

  test('Cannot create bookmark with invalid properties', async () => {
    const testEnv = await getTestEnv();
    const spidey = testEnv.authenticatedContext('spidey');
    const spideyBookmarksDb = collection(spidey.firestore(), 'bookmarks');

    const bookmark = {
      owner: 'spidey',
      name: 'GitHub',
      url: 'https://github.com',
      tags: ['tag1'],
      another: 'unexpected property'
    };

    await assertFails(addDoc(spideyBookmarksDb, bookmark));
  });

  test('Cannot change owner of bookmark', async () => {
    const testEnv = await getTestEnv();
    const spidey = testEnv.authenticatedContext('spidey');
    const spideyBookmarksDb = collection(spidey.firestore(), 'bookmarks');

    const bookmarkData = {
      owner: 'spidey',
      name: 'GitHub',
      url: 'https://github.com',
      tags: ['tag1']
    };

    const bookmarkDataOwnerUpdate = {
      owner: 'gobby',
      name: 'GitHub',
      url: 'https://github.com',
      tags: ['tag1']
    };

    // create bookmark
    const bookmarkRef = await addDoc(spideyBookmarksDb, bookmarkData);

    // attempt to set owner property
    await assertFails(updateDoc(bookmarkRef, bookmarkDataOwnerUpdate));
  });

  test('Cannot change created timestamp of bookmark', async () => {
    const testEnv = await getTestEnv();
    const spidey = testEnv.authenticatedContext('spidey');
    const spideyBookmarksDb = collection(spidey.firestore(), 'bookmarks');

    const bookmarkData = {
      owner: 'spidey',
      name: 'GitHub',
      url: 'https://github.com',
      tags: ['tag1']
    };

    const bookmarkDataChangeCratedTimestamp = {
      name: 'GitHub',
      url: 'https://github.com',
      tags: ['tag1'],
      created: new Date().toISOString()
    };

    // create bookmark
    const bookmarkref = await addDoc(spideyBookmarksDb, bookmarkData);

    await assertFails(updateDoc(bookmarkref, bookmarkDataChangeCratedTimestamp));
  });

  test('Cannot change updated timestamp of bookmark', async () => {
    const testEnv = await getTestEnv();
    const spidey = testEnv.authenticatedContext('spidey');
    const spideyBookmarksDb = collection(spidey.firestore(), 'bookmarks');

    const bookmarkData = {
      owner: 'spidey',
      name: 'GitHub',
      url: 'https://github.com',
      tags: ['tag1']
    };

    const bookmarkDataChangeUpdatedTimestamp = {
      name: 'GitHub',
      url: 'https://github.com',
      tags: ['tag1'],
      updated: new Date().toISOString()
    };

    // create bookmark
    const bookmarkref = await addDoc(spideyBookmarksDb, bookmarkData);

    await assertFails(updateDoc(bookmarkref, bookmarkDataChangeUpdatedTimestamp));
  });

  test('Cannot add invalid property to bookmark', async () => {
    const testEnv = await getTestEnv();
    const spidey = testEnv.authenticatedContext('spidey');
    const spideyBookmarksDb = collection(spidey.firestore(), 'bookmarks');

    const bookmarkData = {
      owner: 'spidey',
      name: 'GitHub',
      url: 'https://github.com',
      tags: ['tag1']
    };

    const bookmarkDataInvalidProperty = {
      name: 'GitHub',
      url: 'https://github.com',
      tags: ['tag1'],
      invalidProperty: 'some string'
    };

    // create valid bookmark
    const bookmarkRef = await addDoc(spideyBookmarksDb, bookmarkData);

    // attempt to add invalid property
    await assertFails(updateDoc(bookmarkRef, bookmarkDataInvalidProperty));
  });

  test("Cannot read other user's bookmarks", async () => {
    // get environment
    const testEnv = await getTestEnv();

    // create user context
    const spidey = testEnv.authenticatedContext('spidey');

    // create db reference
    const spideyBookmarksDb = collection(spidey.firestore(), 'bookmarks');

    // construct firebase query
    const bookmarksQuery = query(spideyBookmarksDb, where('owner', '==', 'gobby'));

    // test permissions
    await assertFails(getDocs(bookmarksQuery));
  });

  test("Cannot create other user's bookmarks", async () => {
    // get environment
    const testEnv = await getTestEnv();

    // create user context
    const spidey = testEnv.authenticatedContext('spidey');

    // create db reference
    const spideyBookmarksDb = collection(spidey.firestore(), 'bookmarks');

    // bookmark data
    const bookmarkData = {
      owner: 'gobby',
      name: 'GitHUB',
      url: 'https://github.com',
      tags: ['tag1']
    };

    // test permissions
    await assertFails(addDoc(spideyBookmarksDb, bookmarkData));
  });

  test("Cannot update other user's bookmarks", async () => {
    // get environment
    const testEnv = await getTestEnv();

    // create user context
    const spidey = testEnv.authenticatedContext('spidey');
    const gobby = testEnv.authenticatedContext('gobby');

    // create db reference
    const spideyBookmarksDb = collection(spidey.firestore(), 'bookmarks');
    const gobbyBookmarksDb = collection(gobby.firestore(), 'bookmarks');

    // bookmark data
    const bookmarkData = {
      owner: 'spidey',
      name: 'GitHUB',
      url: 'https://github.com',
      tags: ['tag1']
    };

    const bookmarkDataGobbyUpdate = {
      name: 'gobby was here',
      url: 'https:/github.com',
      tags: ['tag1']
    };

    // create spidey bookmark
    const bookmarkRef = doc(spideyBookmarksDb, 'testOtherUserUpdate');
    await setDoc(bookmarkRef, bookmarkData);

    // gobby references
    const bookmarkRefGobby = doc(gobbyBookmarksDb, 'testOtherUserUpdate');

    // test permissions
    await assertFails(setDoc(bookmarkRefGobby, bookmarkDataGobbyUpdate));
  });

  test("Cannot delete other user's bookmarks", async () => {
    // get environment
    const testEnv = await getTestEnv();

    // create user context
    const spidey = testEnv.authenticatedContext('spidey');
    const gobby = testEnv.authenticatedContext('gobby');

    // create db reference
    const spideyBookmarksDb = collection(spidey.firestore(), 'bookmarks');
    const gobbyBookmarksDb = collection(gobby.firestore(), 'bookmarks');

    // bookmark data
    const bookmarkData = {
      owner: 'spidey',
      name: 'GitHUB',
      url: 'https://github.com',
      tags: ['tag1']
    };

    // create spidey bookmark
    const bookmarkRef = doc(spideyBookmarksDb, 'testOtherUserUpdate');
    await setDoc(bookmarkRef, bookmarkData);

    // gobby references
    const bookmarkRefGobby = doc(gobbyBookmarksDb, 'testOtherUserUpdate');

    // test permissions
    await assertFails(deleteDoc(bookmarkRefGobby));
  });
});
