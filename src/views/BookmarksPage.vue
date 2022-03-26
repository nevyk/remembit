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
  IonSplitPane,
  IonMenu,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
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
    <ion-split-pane content-id="main-content">
      <!--  the side menu  -->
      <ion-menu content-id="main-content">
        <ion-toolbar>
          <ion-title>Tags</ion-title>
        </ion-toolbar>
        <ion-content>
          <ion-list lines="none">
            <ion-item
              v-for="tag in bookmarkStore.allTags"
              :key="tag"
              :detail="false"
              button
            >
              <ion-label>{{ tag }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>

      <ion-content id="main-content">
        <TheToolbar></TheToolbar>
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
              <ion-label>{{ bookmark.name }}</ion-label>
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
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-content>
    </ion-split-pane>
    <ion-fab slot="fixed" vertical="bottom" horizontal="end">
      <ion-fab-button @click="showNewBookmarkModal()">
        <ion-icon :icon="addOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-page>
</template>

<style scoped></style>
