<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | null): void;
}>();
const props = defineProps<{
  accept?: string;
  modelValue?: File;
  multiple?: boolean;
  preview?: string;
  placeholder?: string;
}>();

const inputRef = ref<HTMLInputElement>();
const file = ref<File | null>(null);
const fileUrl = ref<string | null>(null);
const isDragging = ref<boolean>(false);
const fileReader = new FileReader();
const preview = computed(() => fileUrl.value || props.preview);
const fileName = computed(() => file.value?.name);

const openFileManager = () => {
  if (file.value) return;
  inputRef.value?.click();
};
const selectFiles = (event: Event) => {
  file.value = (event.target as HTMLInputElement).files?.[0] || null;
  emit('update:modelValue', file.value);
  if (file.value) fileReader.readAsDataURL(file.value);
};
const reset = () => {
  setTimeout(() => {
    file.value = null;
    fileUrl.value = null;
    emit('update:modelValue', file.value);
  }, 0);
}

fileReader.onload = (event) => {
  fileUrl.value = event.target?.result as string | null;
}
</script>

<template>
  <div
    class="bg-gray-50 border border-dashed border-gray-200 px-8 py-4 relative rounded"
    :class="[!file && 'cursor-pointer']"
    @click="openFileManager"
  >
    <input
      ref="inputRef"
      type="file"
      class="absolute inset-0 opacity-0 pointer-events-none"
      :accept="accept"
      @change="selectFiles"
    />
    <div class="flex flex-col gap-8 items-center md:flex-row">
      <div class="bg-gray-100 border grid h-[100px] overflow-hidden place-items-center rounded-full text-3xl text-gray-400 w-[100px]">
        <img v-if="preview" :src="preview" class="h-full object-cover w-full">
        <FontAwesomeIcon v-else icon="far fa-user" />
      </div>
      <div class="flex flex-col gap-4 flex-grow">
        <div v-if="file">
          <div>{{ fileName }}</div>
          <button type="button" class="font-medium text-black text-sm" @click="reset">Reset</button>
        </div>
        <div v-else class="text-center md:text-left">
          <div>Drop file or click to upload.</div>
          <div class="text-gray-500 text-xs">{{ accept?.toUpperCase() }}&nbsp;</div>
        </div>
        <!-- <div class="bg-black bg-opacity-10 h-1 overflow-hidden rounded-full w-full">
          <span class="bg-black block h-full w-[10%]" />
        </div> -->
      </div>
    </div>
  </div>
</template>
