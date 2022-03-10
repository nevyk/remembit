<script setup lang="ts">
import TheToolbar from '../components/TheToolbar.vue';
import {
  IonPage,
  IonHeader,
  IonContent,
  IonItem,
  IonList,
  IonLabel,
  IonButton,
  IonIcon
} from '@ionic/vue';
import { pencilOutline, trashOutline } from 'ionicons/icons';
import { reactive } from 'vue';

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
    <ion-header><TheToolbar></TheToolbar></ion-header>
    <ion-content class="ion-padding">
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
  </ion-page>
</template>

<style scoped></style>
