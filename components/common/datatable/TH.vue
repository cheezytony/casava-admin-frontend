<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { DatatableProvision } from '~~/types/components';

const props = defineProps<{
  name?: string;
}>();

const { sort, setSorting } = inject<DatatableProvision>('datatable')!;
const isSorted = computed(() => sort.value.column === props.name);
const isSortedByAscending = computed(
  () => isSorted.value && sort.value.orderByAscending
);
const isSortedByDescending = computed(
  () => isSorted.value && !sort.value.orderByAscending
);
const handleClick = () => props.name && setSorting(props.name);
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
      <span v-if="name" class="inline-flex flex-col items-center text-xs">
        <FontAwesomeIcon
          icon="sort-up"
          :class="{ 'opacity-25': !isSortedByAscending }"
        />
        <FontAwesomeIcon
          icon="sort-down"
          class="-mt-3"
          :class="{ 'opacity-25': !isSortedByDescending }"
        />
      </span>
    </span>
  </th>
</template>
