<script lang="ts" setup>
import { v4 } from 'uuid';

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
const props = withDefaults(
  defineProps<{
    format?: string | Array<string | number>;
    modelValue?: string;
    placeholder?: string;
  }>(),
  {
    // Equivalent to 6 six digits.
    format: '000000',
  }
);

// The input elements in the split.
const inputRef = ref<Array<HTMLInputElement>>([]);
// The values in the split
const split = ref<Array<string>>([]);
// Generate fields for each input in the split.
const fields = computed(() => {
  const chars =
    typeof props.format === 'string' ? props.format.split('') : props.format;
  return chars.map((char, index) => {
    const isNumber = typeof char === 'number' || !isNaN(parseInt(char));

    return {
      type: isNumber ? 'number' : 'string',
      pattern: isNumber ? /^\d$/ : /^[a-zA-Z]$/,
      id: v4(),
      placeholder: props.placeholder?.[index] || char.toString(),
    };
  });
});

// Listen to focus events to select input value.
const onFocus = (index: number, event: FocusEvent) => {
  (event.target as HTMLInputElement).select();
};
// Listen to all validated input events.
const onInput = () => {
  emit('update:modelValue', split.value.join(''));
};
// Listen to key events that modify the input value.
const onKeypress = (index: number, event: KeyboardEvent) => {
  // Get the value of the key being pressed.
  const key = event.key;

  // Get key for validation.
  const field = fields.value[index];

  // Validate key being pressed.
  if (!key.match(field.pattern)) return event.preventDefault();

  // Always make sure all previous inputs have a value.
  const firstEmptyField = split.value.findIndex((value) => !value);

  if (firstEmptyField > -1 && firstEmptyField !== index) {
    // Update the first empty field.
    updateField(firstEmptyField, key);
    // Prevent updating current field naturally.
    event.preventDefault();
    // Focus the field after the first empty field to maintain normal typing flow.
    return focus(firstEmptyField + 1);
  }

  // Focus next input.
  focus(index + 1);
};
// Handle key up events to navigate the split.
const onKeyUp = (index: number, event: KeyboardEvent) => {
  // const inputValue = (event.target as HTMLInputElement).value;
  switch (event.code) {
    case 'Backspace':
      // Focus previous input when deleting.
      focus(index - 1);
      break;
    case 'ArrowDown':
      // Focus last input.
      focus(fields.value.length - 1);
      break;
    case 'ArrowLeft':
      // Focus previous input.
      focus(index - 1);
      break;
    case 'ArrowRight':
      // Focus next input.
      focus(index + 1);
      break;
    case 'ArrowUp':
      // Focus first input.
      focus(0);
      break;
  }
};
// Handle clipboard paste events.
const onPaste = (event: ClipboardEvent) => {
  const pasteValue = event.clipboardData
    ?.getData('Text')
    // Make sure we don't get more than we need.
    ?.slice(0, fields.value.length);

  // Return if we get nothing at all.
  if (!pasteValue) return;

  // Preven updating the input naturally.
  event.preventDefault();
  split.value = split.value.map((c, index) => {
    const char = pasteValue[index];
    const field = fields.value[index];
    if (!char || !char.match(field.pattern)) return '';
    return char;
  });
  onInput();
};

// Trigger focus on inputs.
const focus = (index: number) => {
  // Wait for next thread of execution.
  setTimeout(() => inputRef.value[index]?.focus(), 0);
};
// Set the value of a part of the string.
const updateField = (index: number, value: string) => {
  split.value = split.value.map((c, i) => {
    if (i === index) return value;
    return c;
  });
  onInput();
};
// Set all parts of the string to the initial value or an empty string.
// The split needs to have the right amount of values or the inputs won't be able to update anything.
const resetValue = () => {
  split.value = Array(fields.value.length)
    .fill('')
    .map((c, index) => props.modelValue?.[index] || '');
};

// Reset split when component loads
onMounted(resetValue);
// Reset split when format changes.
watch([fields], resetValue);
</script>

<template>
  <div class="flex gap-4 items-center">
    <template :key="field.id" v-for="(field, index) in fields">
      <input
        ref="inputRef"
        type="text"
        class="input text-center px-0"
        maxlength="1"
        :placeholder="field.placeholder"
        :disableds="index > 0 ? !split[index - 1] : false"
        v-model="split[index]"
        @focus="onFocus(index, $event)"
        @input="onInput"
        @keypress="onKeypress(index, $event)"
        @keydown="onKeyUp(index, $event)"
        @paste="onPaste($event)"
      />
    </template>
  </div>
</template>
