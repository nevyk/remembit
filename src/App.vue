<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import TheReloadPrompt from './components/TheReloadPrompt.vue';
</script>

<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
  <the-reload-prompt></the-reload-prompt>
</template>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
