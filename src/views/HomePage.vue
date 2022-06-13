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
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title class="ion-text-center" size="large">REMEMBIT</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p>
        This is a personal project for learning. The goal is a simple and cross-platform
        bookmarking tool for those of us who use multiple browsers.
      </p>
      <p>temp text to test ci/cd.</p>
      <ion-button @click="router.push({ name: 'Bookmarks' })">Log In</ion-button>
    </ion-content>
  </ion-page>
</template>

<style scoped></style>
