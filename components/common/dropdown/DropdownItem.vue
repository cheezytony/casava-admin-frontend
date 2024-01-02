<script lang="ts" setup>
import { NuxtLink } from '#components';

defineProps<{
  href?: string;
  isSelected?: boolean;
  index?: number;
}>();
</script>

<template>
  <component
    :is="href ? NuxtLink : 'button'"
    class="flex w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
    :class="[
      isSelected ? 'bg-gray-100 text-black' : 'text-gray-500',
    ]"
    :role="href ? 'link' : 'button'"
    :href="href"
  >
    <slot />
  </component>
</template>
