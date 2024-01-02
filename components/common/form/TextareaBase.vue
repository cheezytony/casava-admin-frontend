<script lang="ts" setup>
const emit = defineEmits(['update:modelValue']);
const props = withDefaults(defineProps<{
  type?: string;
  modelValue?: string | number;
  modelModifiers?: {
    capitalize: boolean;
    number: boolean;
  };
}>(), {
  type: 'text'
});

const listeners = {
  input: (event: KeyboardEvent) => {
    let value = (event.target as HTMLInputElement).value;
    emit('update:modelValue', value);
  },
};

const textareaRef = ref<HTMLTextAreaElement>();
const height = ref<number>();

const resize = async () => {
  if (!textareaRef.value) return;
  height.value = undefined;
  await nextTick();
  height.value = textareaRef.value.scrollHeight;
};

onMounted(resize);
</script>

<template>
  <textarea
    ref="textareaRef"
    v-bind="$attrs"
    :style="{ height: height ? `${height}px` : 'auto' }"
    :value="modelValue"
    v-on="listeners"
    @input="resize"
  ></textarea>
</template>
