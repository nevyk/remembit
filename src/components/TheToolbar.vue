<script setup lang="ts">
import {
  IonToolbar,
  IonTitle,
  IonIcon,
  IonButtons,
  IonButton,
  IonPopover,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/vue';
import { personCircleOutline, logOutOutline } from 'ionicons/icons';
import { useUserStore } from '../store/user';
import { useRouter, useRoute } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

function handleLogout() {
  userStore.logoutUser().then(() => {
    router.push({ name: 'Login' });
  });
}
</script>

<template>
  <ion-toolbar id="toolbar">
    <ion-title>{{ route.name }}</ion-title>
    <ion-buttons id="toolbar-buttons" slot="end">
      <ion-button id="avatar-button" slot="icon-only" shape="round"
        ><ion-icon :icon="personCircleOutline" size="large"></ion-icon
      ></ion-button>
      <ion-popover
        trigger="avatar-button"
        :show-backdrop="false"
        :dismiss-on-select="true"
      >
        <ion-list>
          <ion-item id="logout-button" button lines="none" @click="handleLogout">
            <ion-icon slot="start" :icon="logOutOutline"></ion-icon>
            <ion-label>Logout</ion-label>
          </ion-item>
        </ion-list>
      </ion-popover>
    </ion-buttons>
  </ion-toolbar>
</template>

<style scoped></style>
