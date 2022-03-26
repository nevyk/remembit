import { defineStore } from 'pinia';
import { useUserStore } from './user';
import { db } from '../services/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';
import merge from 'just-merge';
import pick from 'just-pick';
import clone from 'just-clone';

export { BookmarkNew, Bookmark, useBookmarks };

interface Bookmark {
  id: string;
  name: string;
  url: string;
  tags: Array<string>;
  created: string;
  updated: string;
}

interface BookmarksState {
  bookmarks: Array<Bookmark>;
}

interface BookmarkNew {
  name: string;
  url: string;
  tags: Array<string>;
}

const bookmarksDb = collection(db, 'bookmarks');
const userStore = useUserStore();

const useBookmarks = defineStore('bookmarks', {
  state: (): BookmarksState => {
    return {
      bookmarks: []
    };
  },

  actions: {
    initializeBookmarksListner() {
      const bookmarksQuery = query(bookmarksDb, where('owner', '==', userStore.uid));
      return onSnapshot(bookmarksQuery, (snapshot) => {
        this.bookmarks = snapshot.docs.map((doc) => {
          const bookmark: Bookmark = {
            id: doc.id,
            name: doc.data().name,
            url: doc.data().url,
            tags: doc.data().tags,
            created: doc.data().created,
            updated: doc.data().updated
          };

          return bookmark;
        });
      });
    },

    createBookmark(newBookmark: BookmarkNew) {
      return addDoc(bookmarksDb, merge(newBookmark, { owner: userStore.uid }));
    },

    updateBookmark(bookmarkUpdate: Bookmark) {
      const updates = pick(bookmarkUpdate, ['name', 'url', 'tags']);
      return updateDoc(doc(bookmarksDb, bookmarkUpdate.id), updates);
    },

    deleteBookmark(bookmark: Bookmark) {
      return deleteDoc(doc(bookmarksDb, bookmark.id));
    },

    getByTag(tag: string) {
      return this.bookmarks.filter((bookmark) => {
        return bookmark.tags.includes(tag);
      });
    },

    getById(id: string): Bookmark {
      const result = this.bookmarks.find((bookmark) => {
        return bookmark.id === id;
      });

      if (result) {
        return clone(result);
      } else {
        return {
          id: '',
          name: '',
          url: '',
          tags: [],
          created: '',
          updated: ''
        };
      }
    }
  },

  getters: {
    allTags: (state) => {
      const tagList: Array<string> = [];

      state.bookmarks.forEach((bookmark) => {
        bookmark.tags.forEach((tag) => {
          tagList.includes(tag) ? true : tagList.push(tag);
        });
      });

      return tagList;
    },

    untaggedBookmarks: (state) => {
      return state.bookmarks.filter((bookmark) => {
        return bookmark.tags.length === 0;
      });
    }
  }
});
