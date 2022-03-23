<script setup lang="ts">
import {
  IonContent,
  IonButton,
  modalController,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonChip,
  IonIcon,
  IonText
} from '@ionic/vue';
import { closeCircleOutline } from 'ionicons/icons';
import { BookmarkNew, useBookmarks } from '../store/bookmarks';
import { useField } from 'vee-validate';
import { reactive } from 'vue';
import { string as yupString } from 'yup';

// bookmarks store
const bookmarksStore = useBookmarks();

const newBookmark: BookmarkNew = reactive({
  name: '',
  url: '',
  tags: []
});

// form fields
const {
  value: newBookmarkName,
  errorMessage: newBookmarkNameError,
  validate: validateNewBookmarkName
} = useField<string>('newBookmarkName', yupString().required());

const {
  value: newBookmarkUrl,
  errorMessage: newBookmarkUrlError,
  validate: validateNewBookmarkUrl
} = useField<string>('newBookmarkUrl', yupString().url().required());

const {
  value: newBookmarkTag,
  errorMessage: newBookmarkTagError,
  validate: validateNewBookmarkTag,
  resetField: resetNewBookmarkTag
} = useField<string>('newBookmarkTag', yupString().min(1), {
  validateOnValueUpdate: false
});

async function pushTag() {
  await validateNewBookmarkTag();
  if (newBookmarkTag.value && !newBookmark.tags.includes(newBookmarkTag.value)) {
    newBookmark.tags.push(newBookmarkTag.value);
    resetNewBookmarkTag();
  }
}

function removeTag(tagIndex: number) {
  newBookmark.tags.splice(tagIndex, 1);
}

// modal controls
function closeModal() {
  modalController.dismiss();
}

async function validateForm() {
  const nameIsValid = (await validateNewBookmarkName()).valid;
  const urlIsValid = (await validateNewBookmarkUrl()).valid;

  if (nameIsValid && urlIsValid) {
    return true;
  } else {
    return false;
  }
}

async function submit() {
  const formIsValid = await validateForm();

  newBookmark.name = newBookmarkName.value;
  newBookmark.url = newBookmarkUrl.value;

  if (formIsValid) {
    bookmarksStore.createBookmark(newBookmark).then(() => {
      closeModal();
    });
  }
}
</script>

<template>
  <ion-toolbar id="new-bookmark-toolbar">
    <ion-title id="new-bookmark-title">New Bookmark</ion-title>
  </ion-toolbar>
  <ion-content class="ion-padding">
    <form id="new-bookmark-form">
      <ion-item id="bookmark-name-container">
        <ion-label id="bookmark-name-label" position="floating">Name</ion-label>
        <ion-input
          id="bookmark-name-input"
          v-model.trim="newBookmarkName"
          placeholder="Bookmark Name"
        ></ion-input>
        <span id="bookmark-name-error-container">
          <ion-text id="bookmark-name-error" color="danger" class="error-text">{{
            newBookmarkNameError
          }}</ion-text>
        </span>
      </ion-item>

      <ion-item id="new-bookmark-url-container">
        <ion-label id="bookmark-url-label" position="floating">Url</ion-label>
        <ion-input
          id="bookmark-url-input"
          v-model.trim="newBookmarkUrl"
          placeholder="Bookmark Url"
        ></ion-input>
        <span id="bookmark-url-error-container">
          <ion-text id="bookmark-url-error" color="danger" class="error-text">{{
            newBookmarkUrlError
          }}</ion-text>
        </span>
      </ion-item>

      <ion-item id="new-bookmark-tag-container">
        <ion-label id="bookmark-tag-label" position="floating">Tag</ion-label>
        <ion-input
          id="bookmark-tag-input"
          v-model.trim="newBookmarkTag"
          placeholder="Add Tag"
          @keyup.enter="pushTag"
        ></ion-input>
        <span id="bookmark-tag-error-container">
          <ion-text id="bookmark-tag-error" color="danger" class="error-text">{{
            newBookmarkTagError
          }}</ion-text>
        </span>
      </ion-item>
    </form>
    <ion-item id="tag-list-container" lines="none">
      <ion-chip
        v-for="(tag, tagIndex) in newBookmark.tags"
        id="tag"
        :key="tagIndex"
        color="primary"
      >
        <ion-label id="tag-chip-label">{{ tag }}</ion-label>
        <ion-icon
          id="tag-chip-icon"
          :icon="closeCircleOutline"
          @click.stop="removeTag(tagIndex)"
        ></ion-icon>
      </ion-chip>
    </ion-item>
  </ion-content>
  <ion-toolbar id="footer-buttons">
    <ion-buttons id="button-submit-container" slot="primary">
      <ion-button id="button-submit" color="primary" @click="submit()"
        >Create Bookmark</ion-button
      >
    </ion-buttons>
    <ion-buttons id="button-cancel-container" slot="secondary">
      <ion-button id="button-cancel" color="danger" @click="closeModal()"
        >Cancel</ion-button
      >
    </ion-buttons>
  </ion-toolbar>
</template>

<style scoped>
.error-text {
  font-size: small;
}
</style>
