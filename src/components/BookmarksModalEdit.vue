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
import { useBookmarks } from '../store/bookmarks';
import { reactive, defineProps } from 'vue';
import { useBookmarkFormFields } from '../composables/bookmarkFormFields';

// props
const props = defineProps({
  bookmarkId: {
    type: String,
    required: true
  }
});

// bookmarks store
const bookmarksStore = useBookmarks();

// local copy of bookmark
const bookmark = reactive(bookmarksStore.getById(props.bookmarkId));

// new bookmark form and set initial values
const bookmarkForm = useBookmarkFormFields();
bookmarkForm.bookmarkName.value = bookmark.name;
bookmarkForm.bookmarkUrl.value = bookmark.url;

// tags functions
async function pushTag() {
  await bookmarkForm.validatebookmarkTag();
  if (
    bookmarkForm.bookmarkTag.value &&
    !bookmark.tags.includes(bookmarkForm.bookmarkTag.value)
  ) {
    bookmark.tags.push(bookmarkForm.bookmarkTag.value);
    bookmarkForm.resetbookmarkTag();
  }
}

function removeTag(tagIndex: number) {
  bookmark.tags.splice(tagIndex, 1);
}

// modal controls
function closeModal() {
  modalController.dismiss();
}

async function validateForm() {
  const nameIsValid = (await bookmarkForm.validatebookmarkName()).valid;
  const urlIsValid = (await bookmarkForm.validatebookmarkUrl()).valid;

  if (nameIsValid && urlIsValid) {
    return true;
  } else {
    return false;
  }
}

async function submit() {
  const formIsValid = await validateForm();

  bookmark.name = bookmarkForm.bookmarkName.value;
  bookmark.url = bookmarkForm.bookmarkUrl.value;

  if (formIsValid) {
    bookmarksStore.updateBookmark(bookmark).then(() => {
      closeModal();
    });
  }
}
</script>

<template>
  <ion-toolbar id="new-bookmark-toolbar">
    <ion-title id="new-bookmark-title">Edit Bookmark</ion-title>
  </ion-toolbar>
  <ion-content class="ion-padding">
    <form id="new-bookmark-form">
      <ion-item id="bookmark-name-container">
        <ion-label id="bookmark-name-label" position="floating">Name</ion-label>
        <ion-input
          id="bookmark-name-input"
          v-model.trim="bookmarkForm.bookmarkName.value"
          placeholder="Bookmark Name"
        ></ion-input>
        <span id="bookmark-name-error-container">
          <ion-text id="bookmark-name-error" color="danger" class="error-text">{{
            bookmarkForm.bookmarkNameError.value
          }}</ion-text>
        </span>
      </ion-item>

      <ion-item id="new-bookmark-url-container">
        <ion-label id="bookmark-url-label" position="floating">Url</ion-label>
        <ion-input
          id="bookmark-url-input"
          v-model.trim="bookmarkForm.bookmarkUrl.value"
          placeholder="Bookmark Url"
        ></ion-input>
        <span id="bookmark-url-error-container">
          <ion-text id="bookmark-url-error" color="danger" class="error-text">{{
            bookmarkForm.bookmarkUrlError.value
          }}</ion-text>
        </span>
      </ion-item>

      <ion-item id="new-bookmark-tag-container">
        <ion-label id="bookmark-tag-label" position="floating">Tag</ion-label>
        <ion-input
          id="bookmark-tag-input"
          v-model.trim="bookmarkForm.bookmarkTag.value"
          placeholder="Add Tag"
          @keyup.enter="pushTag"
        ></ion-input>
        <span id="bookmark-tag-error-container">
          <ion-text id="bookmark-tag-error" color="danger" class="error-text">{{
            bookmarkForm.bookmarkTagError.value
          }}</ion-text>
        </span>
      </ion-item>
    </form>
    <ion-item id="tag-list-container" lines="none">
      <ion-chip
        v-for="(tag, tagIndex) in bookmark.tags"
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
      <ion-button id="button-submit" color="primary" @click="submit()">Submit</ion-button>
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
