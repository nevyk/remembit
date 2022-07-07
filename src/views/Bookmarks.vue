<script setup lang="ts">
import {
  IonPage,
  IonList,
  IonButton,
  IonIcon,
  IonContent,
  IonButtons,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonSearchbar,
  IonModal
} from '@ionic/vue';
import { add, bookmark } from 'ionicons/icons';
import { useBookmarks } from '../store/bookmarks';
import BookmarksModalNew from '../components/BookmarksModalNew.vue';
import BookmarkListEntry from '../components/BookmarkListEntry.vue';
import { ref } from 'vue';

// component refs
const bookmarksPage = ref<HTMLElement>();

// bookmarks store
const bookmarkStore = useBookmarks();
bookmarkStore.initializeBookmarksListner();

// new bookmark modal
const newBookmarkModalAttrs = {
  isOpen: ref(false),
  breakpoints: [0, 0.25, 0.5, 0.75, 1],
  initialBreakbpoint: 0.75
};

function showNewBookmarkModal() {
  newBookmarkModalAttrs.isOpen.value = true;
}
function dismissNewBookmarkModal() {
  newBookmarkModalAttrs.isOpen.value = false;
}
</script>

<template>
  <ion-page id="bookmarks-page" ref="bookmarksPage">
    <ion-header>
      <ion-toolbar>
        <ion-title>Bookmarks</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="showNewBookmarkModal()">
            <ion-icon :icon="bookmark"></ion-icon>
            <ion-icon :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar collaps>
        <ion-searchbar
          id="searchbar"
          enterkeyhint="search"
          inputmode="search"
          type="search"
        ></ion-searchbar> </ion-toolbar
    ></ion-header>

    <ion-content>
      <!-- Bookmark List -->
      <ion-list>
        <!-- Bookmark Item -->
        <BookmarkListEntry
          v-for="bookmark in bookmarkStore.bookmarks"
          :key="bookmark.id"
          :bookmark-id="bookmark.id"
        />
      </ion-list>
    </ion-content>
    <ion-modal
      :is-open="newBookmarkModalAttrs.isOpen.value"
      :breakpoints="newBookmarkModalAttrs.breakpoints"
      :initial-breakpoint="newBookmarkModalAttrs.initialBreakbpoint"
      @will-dismiss="dismissNewBookmarkModal()"
    >
      <BookmarksModalNew />
    </ion-modal>
  </ion-page>
</template>

<style scoped>
#searchbar {
  --box-shadow: none;
}
</style>
