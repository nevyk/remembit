<script setup lang="ts">
import TheToolbar from '../components/TheToolbar.vue';
import { IonPage, IonHeader, IonContent } from '@ionic/vue';
</script>

<template>
  <ion-page>
    <ion-header><TheToolbar></TheToolbar></ion-header>
    <ion-content class="ion-padding">Bookmarks Page. </ion-content>
  </ion-page>
</template>

<style scoped></style>
