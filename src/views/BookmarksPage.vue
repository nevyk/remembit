<script setup lang="ts">
import TheToolbar from '../components/TheToolbar.vue';
import {
  IonPage,
  IonItem,
  IonList,
  IonLabel,
  IonButton,
  IonIcon,
  IonContent,
  IonFab,
  IonFabButton,
  IonChip,
  IonButtons,
  modalController
} from '@ionic/vue';
import { pencilOutline, trashOutline, addOutline } from 'ionicons/icons';
import { useBookmarks } from '../store/bookmarks';
import BookmarksModalNew from '../components/BookmarksModalNew.vue';
import BookmarksModalEdit from '../components/BookmarksModalEdit.vue';
import { ref } from 'vue';

// component refs
const bookmarksPage = ref<HTMLElement>();

// bookmarks store
const bookmarkStore = useBookmarks();
bookmarkStore.initializeBookmarksListner();

// new bookmark modal
async function showNewBookmarkModal() {
  const modal = await modalController.create({
    component: BookmarksModalNew,
    presentingElement: bookmarksPage.value
  });

  return modal.present();
}

// edit bookmark modal
async function showEditBookmarkModal(id: string) {
  const modal = await modalController.create({
    component: BookmarksModalEdit,
    componentProps: {
      bookmarkId: id
    },
    presentingElement: bookmarksPage.value
  });

  return modal.present();
}
</script>

<template>
  <ion-page id="bookmarks-page" ref="bookmarksPage">
    <TheToolbar></TheToolbar>
    <ion-content id="main-content">
      <ion-content>
        <!-- Bookmark List -->
        <ion-list>
          <ion-item
            v-for="bookmark in bookmarkStore.bookmarks"
            :key="bookmark.id"
            :href="bookmark.url"
            target="_blank"
            rel="noopener"
          >
            <ion-label>
              <h2>{{ bookmark.name }}</h2>
              <ion-chip
                v-for="tag in bookmark.tags"
                :key="bookmark.tags.indexOf(tag)"
                :disabled="true"
              >
                <small>{{ tag }}</small>
              </ion-chip>
            </ion-label>

            <ion-buttons>
              <ion-button
                fill="clear"
                color="primary"
                type="button"
                @click.stop.prevent="showEditBookmarkModal(bookmark.id)"
              >
                <ion-icon slot="icon-only" :icon="pencilOutline"></ion-icon>
              </ion-button>

              <ion-button
                fill="clear"
                color="danger"
                type="button"
                @click.stop.prevent="bookmarkStore.deleteBookmark(bookmark)"
              >
                <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-content>
    <ion-fab slot="fixed" vertical="bottom" horizontal="end">
      <ion-fab-button @click="showNewBookmarkModal()">
        <ion-icon :icon="addOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-page>
</template>

<style scoped></style>
