<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { Form, FormFieldNormalized, FormInputValue } from 'vue3-form';
import { isEmpty } from '../../../utils/helpers';
import FormInput from './FormInput.vue';
import FormSelect from './FormSelect.vue';
import FormPassword from './FormPassword.vue';
import FormTextarea from './FormTextarea.vue';
import FormSplitInput from './FormSplitInput.vue';
import FormDropzone from './FormDropzone.vue';
import FormPhone from './FormPhone.vue';
import FormCurrency from './FormCurrency.vue';
import FormRange from './FormRange.vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  id?: string;
  field?: Partial<FormFieldNormalized>;
  form?: Form;
  label?: string;
  modelValue?: FormInputValue;
  modelModifiers?: {};
  name?: string;
  type?: string;
}>();

const isFocused = ref(false);
const listeners = {
  blur: () => (isFocused.value = false),
  'update:modelValue': (value: any) => emit('update:modelValue', value),
  focus: () => (isFocused.value = true),
};

const component = computed(() => {
  switch (props.type) {
    case 'currency':
      return FormCurrency;
    case 'dropzone':
      return FormDropzone;
    case 'password':
      return FormPassword;
    case 'range':
      return FormRange;
    case 'select':
      return FormSelect;
    case 'textarea':
      return FormTextarea;
    case 'split':
      return FormSplitInput;
    case 'phone':
      return FormPhone;
    case 'text':
    default:
      return FormInput;
  }
});
const isActive = computed<boolean>(
  () => isFocused.value || !isEmpty(props.modelValue)
);
const field = computed<Partial<FormFieldNormalized> | undefined>(() => {
  if (props.field) return props.field;
  return props.name ? props.form?.fields?.[props.name] : undefined;
});
const errors = computed<string[]>(() => {
  return Object.values(field?.value?.errors || {}).concat(
    field?.value?.serverErrors || []
  );
});
const hasErrors = computed(() => errors.value.length);
</script>

<template>
  <div
    class="flex flex-col gap-2 group"
    :class="[hasErrors && 'has-input-error']"
  >
    <div class="flex flex-col gap-2">
      <label
        v-if="label"
        :for="id"
        class="text-sm"
        :class="[hasErrors ? 'text-red-500' : 'text-gray-500']"
      >
        {{ label }}
      </label>
      <component
        v-bind="{ id, name, type, ...$attrs }"
        :is="component"
        :modelValue="(modelValue as any)"
        :modelModifiers="modelModifiers"
        v-on="listeners"
      />
    </div>
    <div v-if="hasErrors" class="flex flex-col gap-1">
      <template :key="n" v-for="(error, n) in errors">
        <div class="text-xs text-red-500 uppercase">{{ error }}</div>
      </template>
    </div>
  </div>
</template>
