<script lang="ts" setup>
const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  absolute?: boolean;
  integer?: boolean;
  modelValue?: number | string;
  min?: number | string;
  type?: string;
}>();

const listeners = {
  change: (event: KeyboardEvent) => {
    emit('update:modelValue', (event.target as HTMLInputElement)?.value);
  },
  input: (event: KeyboardEvent) => {
    emit('update:modelValue', (event.target as HTMLInputElement)?.value);
  },
  keypress: (event: KeyboardEvent) => {
    const currentValue = (event.target as HTMLInputElement)?.value;
    let isAllowed = false;
    const code = event.code;
    const isPeriod = code === 'Period' || code === 'NumpadDecimal';
    const isMinus = code === 'Minus' || code === 'NumpadSubtract';
    const isNumber = code.match(/^Digit/);

    const cursorPosition = (event.target as HTMLInputElement)?.selectionStart;

    if (isNumber) {
      isAllowed = true;
    }
    if (isPeriod && !props.integer) {
      isAllowed = !currentValue.includes('.');
    }
    if (isMinus && !props.absolute) {
      isAllowed = cursorPosition === 0 && !currentValue.includes('-');
    }

    if (!isAllowed) {
      event.preventDefault();
    }
  },
};

const value = ref(props.modelValue ?? '');
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) value.value = newValue;
  }
);
</script>

<template>
  <input
    :type="type"
    v-bind="$attrs"
    :value="modelValue"
    class="input"
    inputmode="numeric"
    v-on="listeners"
  />
</template>
