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
import { reactive } from 'vue';
import { useBookmarkFormFields } from '../composables/bookmarkFormFields';

// bookmarks store
const bookmarksStore = useBookmarks();

// new bookmark skeleton
const newBookmark: BookmarkNew = reactive({
  name: '',
  url: '',
  tags: []
});

// new bookmark form
const newBookmarkForm = useBookmarkFormFields();

// new bookmark tags functions
async function pushTag() {
  await newBookmarkForm.validatebookmarkTag();
  if (
    newBookmarkForm.bookmarkTag.value &&
    !newBookmark.tags.includes(newBookmarkForm.bookmarkTag.value)
  ) {
    newBookmark.tags.push(newBookmarkForm.bookmarkTag.value);
    newBookmarkForm.resetbookmarkTag();
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
  const nameIsValid = (await newBookmarkForm.validatebookmarkName()).valid;
  const urlIsValid = (await newBookmarkForm.validatebookmarkUrl()).valid;

  if (nameIsValid && urlIsValid) {
    return true;
  } else {
    return false;
  }
}

async function submit() {
  const formIsValid = await validateForm();

  newBookmark.name = newBookmarkForm.bookmarkName.value;
  newBookmark.url = newBookmarkForm.bookmarkUrl.value;

  if (formIsValid) {
    bookmarksStore.createBookmark(newBookmark).then(() => {
      closeModal();
    });
  }
}
</script>

<template>
  <ion-toolbar id="new-bookmark-toolbar">
    <ion-title id="new-bookmark-title" class="ion-text-center">New Bookmark</ion-title>
    <ion-button
      id="button-submit"
      slot="end"
      fill="clear"
      color="primary"
      @click="submit()"
      >Save</ion-button
    >
    <ion-button
      id="button-cancel"
      slot="start"
      fill="clear"
      color="danger"
      @click="closeModal()"
      >Cancel</ion-button
    >
  </ion-toolbar>
  <ion-content class="ion-padding">
    <form id="new-bookmark-form">
      <ion-item id="bookmark-name-container">
        <ion-label id="bookmark-name-label" position="floating">Name</ion-label>
        <ion-input
          id="bookmark-name-input"
          v-model.trim="newBookmarkForm.bookmarkName.value"
          placeholder="Bookmark Name"
        ></ion-input>
        <span id="bookmark-name-error-container">
          <ion-text id="bookmark-name-error" color="danger" class="error-text">{{
            newBookmarkForm.bookmarkNameError.value
          }}</ion-text>
        </span>
      </ion-item>

      <ion-item id="new-bookmark-url-container">
        <ion-label id="bookmark-url-label" position="floating">Url</ion-label>
        <ion-input
          id="bookmark-url-input"
          v-model.trim="newBookmarkForm.bookmarkUrl.value"
          placeholder="Bookmark Url"
        ></ion-input>
        <span id="bookmark-url-error-container">
          <ion-text id="bookmark-url-error" color="danger" class="error-text">{{
            newBookmarkForm.bookmarkUrlError.value
          }}</ion-text>
        </span>
      </ion-item>

      <ion-item id="new-bookmark-tag-container">
        <ion-label id="bookmark-tag-label" position="floating">Tag</ion-label>
        <ion-input
          id="bookmark-tag-input"
          v-model.trim="newBookmarkForm.bookmarkTag.value"
          placeholder="Add Tag"
          @keyup.enter="pushTag"
        ></ion-input>
        <span id="bookmark-tag-error-container">
          <ion-text id="bookmark-tag-error" color="danger" class="error-text">{{
            newBookmarkForm.bookmarkTagError.value
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
</template>

<style scoped>
.error-text {
  font-size: small;
}
</style>
