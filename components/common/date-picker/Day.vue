<script lang="ts" setup>
const props = defineProps<{
  day: number;
  month: number;
  year: number;
}>();

const isToday = computed(() => {
  const today = new Date();
  return (
    props.day === today.getDate() &&
    props.month === today.getMonth() &&
    props.year === today.getFullYear()
  );
});
</script>

<template>
  <button
    type="button"
    class="p-2 text-xs text-center rounded-lg"
    :class="[isToday ? 'bg-pink-300 text-white' : 'text-gray-400 hover:bg-pink-50 hover:text-black']"
    :title="`Select ${year}-${month+1}-${day}`"
  >
    {{ day }}
  </button>
</template>
