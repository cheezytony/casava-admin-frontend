<script lang="ts" setup>
import type { Form } from 'vue3-form';

interface SubmitButton {
  form?: Form;
  isLoading?: boolean;
}

defineProps<SubmitButton>();
</script>

<template>
  <Button v-bind="$attrs" class="w-full" :is-loading="form?.loading" type="submit">
    <slot />
  </Button>
</template>
