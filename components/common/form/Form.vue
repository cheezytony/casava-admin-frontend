<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'submit', event: Event): void;
}>();
</script>

<template>
  <form @submit.prevent="emit('submit', $event)">
    <slot />
  </form>
</template>
