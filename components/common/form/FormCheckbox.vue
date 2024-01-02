<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
const props = defineProps<{
  id?: string;
  name?: string;
  modelValue?: boolean;
  value?: string;
}>();

const isChecked = ref<boolean>(props.modelValue || false);

const change = (event: Event) => {
  emit(
    'update:modelValue',
    (isChecked.value = (event.target as HTMLInputElement)?.checked)
  );
};

watch(
  () => props.modelValue,
  (value) => (isChecked.value = value || false)
);
</script>

<template>
  <div class="select-none inline-flex gap-3 items-center group relative">
    <i
      class="border duration-300 flex-shrink-0 inline-flex h-7 items-center justify-center rounded w-7 group-active:scale-50"
      :class="[
        isChecked
          ? 'border-blue-500 bg-blue-500 text-white'
          : 'border-gray-300 text-gray-100 group-hover:border-blue-300 group-hover:text-blue-200',
      ]"
    >
      <FontAwesomeIcon icon="fas fa-check" />
    </i>
    <span class="text-sm text-gray-500 group-hover:text-gray-700">
      <slot />
    </span>
    <input
      :id="id"
      :name="name"
      type="checkbox"
      class="absolute cursor-pointer h-full inset-0 opacity-0 w-full"
      :checked="isChecked"
      :value="value"
      v-bind="$attrs"
      @change="change"
    />
  </div>
</template>
