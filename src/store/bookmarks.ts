import { defineStore } from 'pinia';
import faker from '@faker-js/faker';

interface Bookmark {
  id: string;
  name: string;
  url: string;
  tags: Array<string>;
}

interface BookmarksState {
  bookmarks: Array<Bookmark>;
  allTags: Array<string>;
}

export const useBookmarks = defineStore('bookmarks', {
  state: (): BookmarksState => {
    return {
      bookmarks: [],
      allTags: []
    };
  },

  actions: {
    generateFakeBookmarks() {
      for (let b = 0; b < 29; b++) {
        const bookmark: Bookmark = {
          id: faker.random.alphaNumeric(10),
          name: faker.random.words(2),
          url: faker.internet.url(),
          tags: [faker.datatype.string(5), faker.datatype.string(5)]
        };

        this.bookmarks.push(bookmark);
      }
    },

    generateFakeTags() {
      for (let t = 0; t < 29; t++) {
        this.allTags.push(faker.word.noun());
      }
    }
  },

  getters: {}
});
