<script setup lang="ts">
// imports
import {
  IonPage,
  IonInput,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonText
} from '@ionic/vue';
import { ref } from 'vue';
import {
  Form as VeeForm,
  Field as VeeField,
  ErrorMessage as VeeError
} from 'vee-validate';
import { object, string } from 'yup';
import { useUserStore } from '../store/user';

// Get User Store
const userStore = useUserStore();

// Form data / Validation
const email = ref('');
const password = ref('');
const formValidationSchema = object({
  email: string().required().email(),
  password: string().required()
});

function handleSubmit() {
  userStore.loginUser(email.value, password.value);
}
</script>

<template>
  <ion-page id="login-page">
    <div class="login-card-container">
      <ion-card class="login-card">
        <ion-card-header>
          <ion-card-title>Log in</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <VeeForm
            id="login-form"
            :validation-schema="formValidationSchema"
            @submit="handleSubmit"
          >
            <ion-item id="email-container">
              <ion-label id="email-label" position="floating">Email</ion-label>
              <VeeField
                id="email"
                v-model="email"
                :as="IonInput"
                name="email"
                form="login-form"
                inputmode="email"
                placeholder="Email Address"
                type="email"
                autocomplete="email"
                validate-on-blur
                debounce="300"
              >
              </VeeField>
            </ion-item>
            <VeeError v-slot="{ message }" name="email">
              <ion-text color="danger">{{ message }}</ion-text>
            </VeeError>
            <ion-item>
              <ion-label id="password-label" position="floating">Password</ion-label>
              <VeeField
                id="password"
                v-model="password"
                :as="IonInput"
                name="password"
                form="login-form"
                inputmode="text"
                placeholder="Password"
                type="password"
                autocomplete="current-password"
                validate-on-blur
                debounce="300"
              >
              </VeeField>
            </ion-item>
            <VeeError v-slot="{ message }" name="password">
              <ion-text color="danger">{{ message }}</ion-text>
            </VeeError>
            <ion-button
              class="ion-margin-top ion-text-capitalize"
              expand="block"
              type="submit"
            >
              Submit
            </ion-button>
          </VeeForm>
        </ion-card-content>
      </ion-card>
    </div>
  </ion-page>
</template>

<style scoped>
.login-card {
  flex: 450px 0 1;
  border-style: solid;
  border-color: lightgrey;
  border-width: 1px;
}

.login-card-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.debug1 {
  border: solid;
  color: red;
}
</style>
