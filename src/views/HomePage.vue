<script setup lang="ts">
import {
  IonPage,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonContent,
  IonButton
} from '@ionic/vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center" size="large">REMEMBIT</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      🚧 This app is a WIP

      <ion-button @click="router.push({ name: 'Bookmarks' })">Log In</ion-button>
    </ion-content>
  </ion-page>
</template>

<style scoped></style>
