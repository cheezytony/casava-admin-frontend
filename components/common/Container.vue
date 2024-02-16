<script lang="ts" setup>
defineProps<{
  flushX?: boolean;
  flushY?: boolean;
}>();
</script>

<template>
  <section
    class="max-w-[1140px] mx-auto px-3 md:px-6"
    :class="{
      'max-w-[1140px]': !flushX,
      'py-12': !flushY,
    }"
  >
    <slot />
  </section>
</template>
