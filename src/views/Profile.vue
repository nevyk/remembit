<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonToolbar,
  IonTitle,
  IonHeader
} from '@ionic/vue';
import { logOutOutline } from 'ionicons/icons';
import { useUserStore } from '../store/user';
import { useRouter } from 'vue-router';

// Init
const userStore = useUserStore();
const router = useRouter();

// Page Functions
function handleLogout() {
  userStore.logoutUser().then(() => {
    router.push({ name: 'Login' });
  });
}
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>You</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item button :detail="false" @click="handleLogout()">
          <ion-label>Logout</ion-label>
          <ion-icon :icon="logOutOutline"></ion-icon>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<style scoped></style>
