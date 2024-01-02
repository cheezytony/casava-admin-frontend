<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string): void;
}>();
const props = withDefaults(
  defineProps<{
    editable?: boolean;
    id?: string;
    max?: number;
    min?: number;
    modelValue?: number | string;
  }>(),
  {
    editable: false,
    max: 100,
    min: 0,
    modelValue: 50,
  }
);

const inputValue = ref(props.modelValue);

const setMax = () => {
  emit('update:modelValue', (inputValue.value = props.max));
};
const setMin = () => {
  emit('update:modelValue', (inputValue.value = props.min));
};

const onInput = ($event: Event) => {
  emit(
    'update:modelValue',
    (inputValue.value = ($event.target as HTMLInputElement).valueAsNumber)
  );
};

watch(
  () => props.modelValue,
  (value) => (inputValue.value = value)
);
</script>

<template>
  <div class="flex flex-col gap-4">
    <label :for="id" class="text-sm text-gray-500 group-hover:text-gray-700">
      <slot />
    </label>
    <div class="inline-flex flex-col gap-2">
      <div class="self-start text-center text-sm max-w-[3rem]">
        <input
          v-if="editable"
          class="bg-gray-50 border border-gray-100 text-center px-2 py-1 rounded text-gray-700 w-full"
          type="text"
          :value="inputValue"
          @input="onInput"
        />
        <div
          v-else
          class="bg-gray-50 border border-gray-100 px-2 py-1 rounded text-gray-700"
        >
          {{ inputValue }}
        </div>
      </div>
      <div class="flex gap-4 items-center">
        <button
          type="button"
          class="bg-gray-100 px-2 py-1 rounded text-xs hover:bg-gray-200"
          @click="setMin"
        >
          0
        </button>
        <input :id="id" type="range" :value="inputValue" @input="onInput" />
        <button
          type="button"
          class="bg-gray-100 px-2 py-1 rounded text-xs hover:bg-gray-200"
          @click="setMax"
        >
          100
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/********** Range Input Styles **********/
/*Range Reset*/
input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  width: 100%;
}

/* Removes default focus */
input[type='range']:focus {
  outline: none;
}

/***** Chrome, Safari, Opera and Edge Chromium styles *****/
/* slider track */
input[type='range']::-webkit-slider-runnable-track {
  background-color: theme('colors.gray.100');
  border: 1px solid theme('colors.gray.300');
  border-radius: 0.5rem;
  height: 0.5rem;
}

/* slider thumb */
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  margin-top: -0.5rem; /* Centers thumb on the track */

  /*custom styles*/
  background-color: theme('colors.white');
  border: 1px solid theme('colors.gray.300');
  border-radius: 999px;
  height: 1.5rem;
  width: 1.5rem;
}

input[type='range']:focus::-webkit-slider-thumb {
  background-color: theme('colors.blue.500');
  border: 1px solid theme('colors.gray.100');
  outline: 3px solid theme('colors.gray.100');
  outline-offset: 0.125rem;
}

input[type='range']:read-only::-webkit-slider-thumb {
  background-color: theme('colors.gray.100');
  border: 1px solid theme('colors.gray.300');
}

/******** Firefox styles ********/
/* slider track */
input[type='range']::-moz-range-track {
  background-color: theme('colors.gray.100');
  border: 1px solid theme('colors.gray.300');
  border-radius: 0.5rem;
  height: 0.5rem;
}

/* slider thumb */
input[type='range']::-moz-range-thumb {
  border: none; /*Removes extra border that FF applies*/
  border-radius: 0; /*Removes default border-radius that FF applies*/

  /*custom styles*/
  background-color: theme('colors.white');
  border-radius: 999px;
  height: 1.5rem;
  width: 1.5rem;
}

input[type='range']:focus::-moz-range-thumb {
  background-color: theme('colors.blue.500');
  border: 1px solid theme('colors.gray.100');
  outline: 3px solid theme('colors.gray.100');
  outline-offset: 0.125rem;
}

input[type='range']:read-only::-moz-range-thumb {
  background-color: theme('colors.gray.100');
  border: 1px solid theme('colors.gray.300');
}
</style>
