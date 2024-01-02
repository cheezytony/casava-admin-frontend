<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { DatatableProvision } from '~~/types/components';

const props = defineProps<{
  name?: string;
}>();

const { sort, setSorting } = inject<DatatableProvision>('datatable')!;
const isSorted = computed(() => sort.value.column === props.name);
const icon = computed(() => {
  if (!isSorted.value) return 'sort';
  if (sort.value.orderByAscending) return 'sort-up';
  return 'sort-down';
});
const handleClick = () => {
  if (props.name) setSorting(props.name);
};
</script>

<template>
  <th
    align="left"
    class="font-medium px-4 py-4 text-gray-700 text-xs md:first:pl-8 md:last:pr-8 md:text-sm"
    :class="[name && 'cursor-pointer']"
    @click="handleClick"
  >
    <span class="inline-flex gap-4 items-center">
      <span><slot /></span>
      <span
        v-if="name"
        class="inline-flex items-center text-xs"
        :class="!isSorted && 'text-gray-100'"
      >
        <FontAwesomeIcon :icon="icon" />
      </span>
    </span>
  </th>
</template>
