<script setup lang="ts">
import TheToolbar from '../components/TheToolbar.vue';
import {
  IonPage,
  IonHeader,
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
import { ref, reactive, computed } from 'vue';

const tags = computed(() => {
  const prefix = 'tag';
  let tagArray = [];

  for (let t = 1; t < 30; t++) {
    tagArray.push(`${prefix}${t}`);
  }
  return tagArray;
});

const data = reactive([
  {
    id: 'jf38014jnfjkn094n2v',
    name: 'GitHub',
    url: 'https://github.com',
    tags: ['tag1', 'tag2']
  },
  {
    id: 'jf3803injkenv0837hvle',
    name: 'DuckDuckGo',
    url: 'https://start.duckduckgo.com',
    tags: ['search', 'personal']
  }
]);

function handleEdit() {
  console.log('edit button clicked.');
}
</script>

<template>
  <ion-page>
    <ion-split-pane content-id="main-content">
      <!--  the side menu  -->
      <ion-menu content-id="main">
        <ion-header>
          <ion-toolbar>
            <ion-title>Tags</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list lines="none">
            <ion-item v-for="tag in tags" :key="tag" :detail="false" button>
              <ion-label>{{ tag }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>

      <ion-content id="main-content">
        <ion-header><TheToolbar></TheToolbar></ion-header>
        <!-- Bookmark List -->
        <ion-list>
          <ion-item
            v-for="bookmark in data"
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
    </ion-split-pane>
  </ion-page>
</template>

<style scoped></style>
