<script lang="ts" setup>
export interface DateRange {
  title: string;
  value:
    | 'today'
    | 'yesterday'
    | 'this-week'
    | 'last-week'
    | 'this-month'
    | 'this-year'
    | 'last-year'
    | 'all-time'
    | 'custom';
}

const emit = defineEmits<{
  (e: 'update:model-value', value: [string | null, string | null]): void;
}>();
const props = defineProps<{
  modelValue?: [string | null, string | null];
}>();

const today = new Date().toISOString().split('T')[0];
const ranges: Array<DateRange> = [
  { title: 'Today', value: 'today' },
  { title: 'Yesterday', value: 'yesterday' },
  { title: 'This Week', value: 'this-week' },
  { title: 'Last Week', value: 'last-week' },
  { title: 'This Month', value: 'this-month' },
  { title: 'This Year', value: 'this-year' },
  { title: 'Last Year', value: 'last-year' },
  { title: 'All Time', value: 'all-time' },
  { title: 'Custom', value: 'custom' },
];

const range = ref<DateRange>(ranges[0]);
const setRange = (newRange: DateRange) => {
  let start: Date | null = new Date();
  let end: Date | null = new Date();
  range.value = newRange;
  switch (newRange.value) {
    case 'yesterday':
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
      break;
    case 'this-week':
      start.setDate(start.getDate() - 7);
      break;
    case 'last-week':
      start.setDate(start.getDate() - 14);
      end.setDate(end.getDate() - 7);
      break;
    case 'this-month':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'this-year':
      start.setFullYear(start.getFullYear() - 1);
      start.setMonth(0);
      start.setDate(1);
      break;
    case 'last-year':
      start.setFullYear(start.getFullYear() - 1);
      start.setMonth(0);
      start.setDate(1);
      end.setFullYear(end.getFullYear() - 1);
      end.setMonth(11);
      end.setDate(31);
      break;
    case 'all-time':
      start = null;
      end = null;
      break;
  }

  if (newRange.value !== 'custom') {
    startDate.value = start?.toISOString().split('T')[0] ?? null;
    endDate.value = end?.toISOString().split('T')[0] ?? null;
  
    emit('update:model-value', [startDate.value, endDate.value]);
  }
};

const startDate = ref<string | null>(props.modelValue?.[0] ?? today);
const setStartDate = (newStartDate: string | null) => {
  emit('update:model-value', [(startDate.value = newStartDate), endDate.value]);
};
const endDate = ref<string | null>(props.modelValue?.[1] ?? today);
const setEndDate = (newEndDate: string | null) => {
  emit('update:model-value', [startDate.value, (endDate.value = newEndDate)]);
};
</script>

<template>
  <div class="flex flex-wrap gap-4 items-end">
    <Dropdown>
      <template #default="{ isOpen }">
        <Button
          color-scheme="pink"
          size="sm"
          is-rounded
          left-icon="calendar-days"
          :right-icon="isOpen ? 'angle-up' : 'angle-down'"
        >
          {{ range.title }}
        </Button>
      </template>
      <template #items="{ close }">
        <div id="something" class="min-w-[16rem]">
          <DropdownItem
            v-for="item in ranges"
            :key="item.value"
            :value="item.value"
            :is-selected="item.value === range.value"
            @click="
              () => {
                setRange(item);
                close();
              }
            "
          >
            {{ item.title }}
          </DropdownItem>
        </div>
      </template>
    </Dropdown>
    <FormGroup
      class="input-sm"
      type="date"
      label="From"
      :disabled="range.value !== 'custom'"
      :model-value="startDate"
      @update:model-value="setStartDate"
    />
    <FormGroup
      class="input-sm"
      type="date"
      label="To"
      :disabled="range.value !== 'custom'"
      :model-value="endDate"
      @update:model-value="setEndDate"
    />
  </div>
</template>
