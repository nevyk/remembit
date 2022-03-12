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
  IonToolbar
} from '@ionic/vue';
import { pencilOutline, trashOutline, pricetagsOutline } from 'ionicons/icons';
import { useBookmarks } from '../store/bookmarks';

const bookmarkStore = useBookmarks();
bookmarkStore.generateFakeBookmarks();
bookmarkStore.generateFakeTags();

function handleEdit() {
  console.log('edit button clicked.');
}
</script>

<template>
  <ion-page>
    <ion-split-pane content-id="main-content">
      <!--  the side menu  -->
      <ion-menu content-id="main">
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
              <ion-button fill="clear" color="primary" @click.prevent="handleEdit">
                <ion-icon slot="icon-only" :icon="pencilOutline"></ion-icon>
              </ion-button>
              <ion-button fill="clear" color="danger" @click.prevent="handleEdit">
                <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
              </ion-button>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-content>
    </ion-split-pane>
  </ion-page>
</template>

<style scoped></style>
