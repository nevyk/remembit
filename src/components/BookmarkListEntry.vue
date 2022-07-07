<template>
  <ion-item :href="bookmark.url" target="_blank" rel="noopener" :detail="false">
    <ion-label>
      <h2>{{ bookmark.name }}</h2>
      <ion-chip v-for="tag in bookmark.tags" :key="bookmark.tags.indexOf(tag)" disabled>
        {{ tag }}
      </ion-chip>
    </ion-label>

    <ion-buttons>
      <ion-button
        :id="`options-menu-button-${bookmark.id}`"
        shape="round"
        fill="clear"
        @click.prevent=""
      >
        <ion-icon :icon="ellipsisHorizontalOutline"></ion-icon>

        <!-- Options Menu -->
        <ion-popover
          :dismiss-on-select="true"
          :trigger="`options-menu-button-${bookmark.id}`"
        >
          <ion-list lines="none">
            <ion-item button :detail="false" @click="showEditModal()">
              <ion-icon
                slot="start"
                size="small"
                color="primary"
                :icon="pencilOutline"
              ></ion-icon>
              <ion-label>
                <ion-text color="primary"> Edit </ion-text>
              </ion-label>
            </ion-item>

            <ion-item button :detail="false">
              <ion-icon
                slot="start"
                size="small"
                color="danger"
                :icon="trashOutline"
              ></ion-icon>
              <ion-label>
                <ion-text color="danger"> Delete </ion-text>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-popover>
      </ion-button></ion-buttons
    >
  </ion-item>
  <ion-modal
    :is-open="editModalAttrs.isOpen.value"
    :breakpoints="editModalAttrs.breakpoints"
    :initial-breakpoint="editModalAttrs.initialBreakbpoint"
    @will-dismiss="dismissEditModal()"
  >
    <BookmarksModalEdit :bookmark-id="props.bookmarkId" />
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonList,
  IonItem,
  IonLabel,
  IonChip,
  IonButtons,
  IonButton,
  IonIcon,
  IonPopover,
  IonText,
  IonModal
} from '@ionic/vue';
import { pencilOutline, trashOutline, ellipsisHorizontalOutline } from 'ionicons/icons';
import { ref, defineProps, computed } from 'vue';
import { useBookmarks, Bookmark } from '../store/bookmarks';
import BookmarksModalEdit from '../components/BookmarksModalEdit.vue';

// Props
const props = defineProps({
  bookmarkId: {
    type: String,
    required: true
  }
});

// bookmarks store
const bookmarksStore = useBookmarks();

// get bookmark data
const bookmark = computed(() => {
  return bookmarksStore.bookmarks.find((bookmark) => {
    return bookmark.id === props.bookmarkId;
  }) as Bookmark;
});

const editModalAttrs = {
  isOpen: ref(false),
  breakpoints: [0, 0.25, 0.5, 0.75, 1],
  initialBreakbpoint: 0.75
};

function showEditModal() {
  editModalAttrs.isOpen.value = true;
}
function dismissEditModal() {
  editModalAttrs.isOpen.value = false;
}
</script>

<style scoped></style>
