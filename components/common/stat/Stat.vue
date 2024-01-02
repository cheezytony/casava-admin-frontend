<script lang="ts" setup>
import type { NuxtLinkProps } from 'nuxt/app';
import type { DataListItem } from '~/types';

defineProps<{
  title: string;
  value?: Date | string | number;
  type?: NumberFormat | DateTimeFormat;
  description?: string;
  change?: number;
  href?: NuxtLinkProps['href'];
  isStatus?: boolean;
}>();

const getValue = ({ value, type }: DataListItem) => {
  switch (type) {
    case 'currency':
    case 'currency:compact':
    case 'number':
    case 'number:compact':
    case 'unit':
    case 'unit:compact':
    case 'percentage':
    case 'percentage:compact':
      return value
        ? numberFormat(value as number, type as NumberFormat)
        : value;
    case 'date':
    case 'date:compact':
    case 'date:compact:time':
    case 'date:time':
    case 'time':
      return value
        ? dateTimeFormat(value as Date, type as DateTimeFormat)
        : value;

    default:
      return value;
  }
};
</script>

<template>
  <div
    class="bg-white border border-pink-100 flex flex-col gap-2 justify-between px-6 py-8 rounded-xl w-full md:px-8"
  >
    <div class="text-gray-500 uppercase text-xs">{{ title }}</div>
    <div class="flex flex-col gap-2">
      <div class="text-3xl font-mono">
        {{ getValue({ value, title, type }) ?? 'N/A' }}
      </div>
      <div v-if="description" class="text-xs text-gray-500">
        {{ description }}
      </div>
    </div>
  </div>
</template>
