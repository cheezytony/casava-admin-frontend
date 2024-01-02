<template>
  <div class="relative">
    <input
      ref="inputRef"
      :id="id"
      v-bind="$attrs"
      :type="showPassword ? 'text' : 'password'"
      class="input"
      :value="modelValue"
      v-on="listeners"
    />
    <button
      v-if="canTogglePassword"
      type="button"
      class="absolute duration-300 px-3 py-1 right-[1rem] rounded text-gray-500 top-1/2 transform -translate-y-1/2 z-[1] hover:bg-blue-50 hover:text-blue-500 active:scale-50"
      @click="toggleShowPassword"
    >
      <FontAwesomeIcon
        :icon="showPassword ? 'far fa-eye-slash' : 'far fa-eye'"
      />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';

const emit = defineEmits(['update:modelValue']);
withDefaults(
  defineProps<{
    canTogglePassword?: boolean;
    modelValue?: string;
    id?: string;
  }>(),
  {
    canTogglePassword: true,
  }
);

const inputRef = ref<HTMLInputElement>();

const showPassword = ref(false);
const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
  inputRef.value?.focus();
};

const listeners = {
  change: (event: KeyboardEvent) => {
    emit('update:modelValue', (event.target as HTMLInputElement)?.value);
  },
  input: (event: KeyboardEvent) => {
    emit('update:modelValue', (event.target as HTMLInputElement)?.value);
  },
};
</script>
