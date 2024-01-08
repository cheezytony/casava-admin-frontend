<script lang="ts" setup>
const props = defineProps<{
  month: number;
  year: number;
  isActive: boolean;
}>();

const isLeapYear = computed(() => props.year % 4 === 0);

const days = computed(() =>
  [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ].map((day) => day.slice(0, 3))
);
const monthName = computed(() => {
  return [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'Novermber',
    'December',
  ][props.month];
});
const daysInMonth = computed(() => {
  return [
    31,
    isLeapYear.value ? 29 : 28,
    31,
    30,
    31,
    30,
    30,
    31,
    30,
    31,
    30,
    31,
  ][props.month];
});
const firstDayInMonth = computed(() => {
  return new Date(props.year, props.month, 1);
});
const monthOffset = computed(() => firstDayInMonth.value.getDay());
const totalDayCells = computed(() => daysInMonth.value + monthOffset.value);
// const totalDayRows = computed(() => totalDayCells.value / 7);
</script>

<template>
  <div class="border px-1 py-2 rounded-xl md:px-2" :class="[isActive ? 'border-pink-200' : 'border-transparent' ]">
    <div class="flex flex-col px-2">
      <div class="text-xs text-pink-400">{{ monthName }}</div>
      <div class="text-lg font-bold">{{ year }}</div>
    </div>
    <div class="grid grid-cols-7">
      <template v-for="day in days" :key="day">
        <div class="text-xs p-2 text-gray-400">{{ day }}</div>
      </template>
    </div>
    <div class="grid grid-cols-7">
      <template v-for="_i in monthOffset">
        <DatePickerSpace />
      </template>
      <template v-for="day in totalDayCells">
        <DatePickerDay v-bind="{ day, month, year }" />
      </template>
    </div>
  </div>
</template>
