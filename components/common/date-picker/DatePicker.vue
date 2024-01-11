<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'update:model-value', value?: Date): void;
}>();
const props = withDefaults(
  defineProps<{
    monthCount?: number;
    modelValue?: Date;
  }>(),
  {
    monthCount: 1,
  }
);

const isOpen = ref(false);
const today = new Date();
const inputValue = ref(props.modelValue ?? today);
const inputValueFormatted = computed(() => {
  return inputValue.value?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
});
const navigationDate = ref(inputValue.value ?? today);
const year = computed(() => navigationDate.value?.getFullYear());
const month = computed(() => navigationDate.value?.getMonth());
const day = computed(() => navigationDate.value?.getDate());
const monthIndex = computed(() => Math.ceil(props.monthCount / 2) - 1);
const months = computed(() => {
  if (props.monthCount === 12) {
    return Array(12)
      .fill(null)
      .map((_, index) => [year.value, index]);
  }
  return Array(props.monthCount)
    .fill(null)
    .map((_, index) => {
      const diff = index - monthIndex.value;
      const _month = month.value + diff;
      const _year =
        _month < 0 ? year.value - 1 : _month > 11 ? year.value + 1 : year.value;
      return [
        _year,
        _month < 0 ? 12 + _month : _month > 11 ? _month - 12 : _month,
      ];
    });
});

const isActiveMonth = (month: number, year: number) => {
  return (
    month === navigationDate.value.getMonth() &&
    year === navigationDate.value.getFullYear()
  );
};

const goToNextMonth = () => {
  navigationDate.value = new Date(year.value, month.value + 1, 1);
};
const goToPreviousMonth = () => {
  navigationDate.value = new Date(year.value, month.value - 1, 1);
};
</script>

<template>
  <Popper>
    <template #default>
      <div class="flex gap-2">
        <input
          type="text"
          class="input input-sm"
          :value="inputValueFormatted"
          readonly
        />
      </div>
    </template>
    <template #popper>
      <div
        class="flex flex-col gap-6 max-w-xs bg-white border border-pink-200 px-6 py-8 rounded-xl md:px-8 md:gap-8 md:max-w-2xl lg:max-w-3xl xl:max-w-6xl"
        :class="{
          'opacity-0 pointer-events-none invisible': !isOpen,
        }"
      >
        <div class="gap-6 flex justify-center items-center md:gap-8">
          <Button
            color-scheme="pink"
            size="sm"
            left-icon="angle-left"
            @click="goToPreviousMonth"
          />
          <Button
            color-scheme="pink"
            size="sm"
            left-icon="angle-right"
            @click="goToNextMonth"
          />
        </div>
        <div class="flex flex-wrap justify-around md:gap-8">
          <template
            v-for="[_year, _month] in months"
            :key="`${_month}-${_year}`"
          >
            <DatePickerMonth
              v-bind="{
                month: _month,
                year: _year,
                isActive: isActiveMonth(_month, _year),
              }"
            />
          </template>
        </div>
      </div>
    </template>
  </Popper>
</template>
