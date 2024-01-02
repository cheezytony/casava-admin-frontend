<script lang="ts" setup>
interface Option {
  title: string;
  value: string;
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | boolean): void;
}>();
const props = withDefaults(
  defineProps<{
    id?: string;
    modelValue?: boolean | string;
    options?: [Option, Option];
  }>(),
  {
    modelValue: false,
  }
);

const inputValue = ref<boolean | string>(props.modelValue);

const onOption = computed(() => props.options?.[0]);
const offOption = computed(() => props.options?.[1]);
const hasValidOptions = computed(() => !!onOption.value && !!offOption.value);
const isOn = computed(() => {
  if (!hasValidOptions.value) return inputValue.value === true;
  return inputValue.value === onOption.value?.value;
});
const isOff = computed(() => {
  if (!hasValidOptions.value) return inputValue.value === false;
  return inputValue.value === offOption.value?.value;
});
const isChecked = computed(() => (isOn.value ? true : false));

const onChange = (event: Event) => {
  const checked: boolean = (event.target as HTMLInputElement)?.checked;
  let value: string | boolean = checked;
  if (hasValidOptions.value) {
    value = (checked ? onOption.value?.value : offOption.value?.value) as unknown as string;
  }
  emit('update:modelValue', (inputValue.value = value));
};

watch(
  () => props.modelValue,
  (value) => (inputValue.value = value || false)
);
</script>

<template>
  <div class="mb-4 select-none inline-flex gap-3 items-center group relative">
    <span
      v-if="offOption"
      class="text-sm text-gray-500 group-hover:text-gray-700"
    >
      {{ offOption.title }}
    </span>
    <i
      class="border duration-300 flex-shrink-0 inline-flex h-5 items-center justify-center relative rounded-full w-12 group-active:scale-50"
      :class="[
        isChecked
          ? 'border-blue-500 bg-blue-500'
          : 'bg-gray-50 border-gray-300 text-gray-100 group-hover:bg-blue-50 group-hover:border-blue-300',
      ]"
    >
      <span
        class="absolute bg-white border duration-300 h-7 left-0 rounded-full top-1/2 -translate-y-1/2 w-7"
        :class="[
          isChecked
            ? 'border-blue-500 translate-x-5'
            : '-translate-x-px group-hover:border-blue-300',
        ]"
      />
    </i>
    <span
      v-if="onOption"
      class="text-sm text-gray-500 group-hover:text-gray-700"
    >
      {{ onOption.title }}
    </span>
    <span class="text-sm text-gray-500 group-hover:text-gray-700">
      <slot />
    </span>
    <input
      :id="id"
      type="checkbox"
      class="absolute cursor-pointer h-full inset-0 opacity-0 w-full"
      :checked="isChecked"
      v-bind="$attrs"
      @change="onChange"
    />
  </div>
</template>
