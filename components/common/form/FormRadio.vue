<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean | string): void;
}>();
const props = defineProps<{
  id?: string;
  name?: string;
  modelValue?: any;
  value?: string;
}>();

const isChecked = ref<boolean | string>(false);

const change = (event: Event) => {
  emit('update:modelValue', (isChecked.value = props.value || true));
};

watch(
  () => props.modelValue,
  (modelValue) => {
    if (props.value) {
      isChecked.value = modelValue === props.value;
    }
    // isChecked.value = modelValue || false;
  }
);
</script>

<template>
  <div class="mb-4 select-none inline-flex gap-3 items-center group relative">
    <i
      class="border duration-300 flex-shrink-0 inline-flex h-7 items-center justify-center p-1 rounded-full w-7 group-active:scale-50"
      :class="[
        isChecked
          ? 'border-blue-500'
          : 'border-gray-300 group-hover:border-blue-300',
      ]"
    >
      <i
        class="bg-blue-500 duration-300 h-full rounded-full w-full"
        :class="[!isChecked && 'scale-50 opacity-0']"
      ></i>
    </i>
    <span class="text-sm text-gray-500 group-hover:text-gray-700">
      <slot />
    </span>
    <input
      :id="id"
      :name="name"
      type="radio"
      class="absolute cursor-pointer h-full inset-0 opacity-0 w-full"
      :checked="value ? isChecked === value : !!isChecked"
      :value="value"
      v-bind="$attrs"
      @change="change"
    />
  </div>
</template>
