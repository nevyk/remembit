<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="bookmarks" href="/neocortex/bookmarks">
          <ion-icon :icon="bookmarksOutline"></ion-icon>
          <ion-label>Bookmarks</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="profile" href="/neocortex/profile">
          <ion-icon :icon="personCircleOutline"></ion-icon>
          <ion-label>You</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonRouterOutlet,
  IonPage,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon
} from '@ionic/vue';

import { bookmarksOutline, personCircleOutline } from 'ionicons/icons';
</script>

<style scoped></style>
