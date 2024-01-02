<script lang="ts" setup>
defineProps<{
  flush?: boolean;
  title?: string;
}>();
</script>

<template>
  <section
    class="flex flex-col gap-6 justify-stretch"
    :class="{
      'bg-white border border-pink-100 px-6 py-8 rounded-xl': !flush,
    }"
  >
    <div class="flex items-center" v-if="title || $slots.cta">
      <div class="text-gray-500 uppercase text-sm" v-if="title">
        {{ title }}
      </div>
      <div
        class="gap-4 flex flex-grow items-center justify-end"
        v-if="$slots.cta"
      >
        <slot name="cta" />
      </div>
    </div>
    <slot />
  </section>
</template>
