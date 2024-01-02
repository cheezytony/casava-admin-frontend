<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { DatatableProvision } from '~~/types/components';
import { sentenceCase, titleCase } from '~~/utils/filters/strings';

const {
  search,
  searchColumns,
  showSearchColumns,
  searchColumnNames,
  searchOnServer,
  setSearchColumn,
  setSearchKey,
  navigate,
} = inject<DatatableProvision>('datatable')!;

const columns = computed(() => {
  return searchColumns.map((col) => {
    const name = typeof col === 'string' ? col : col.name;
    const title = typeof col === 'string' ? titleCase(col) : col.title;
    return {
      name,
      title,
      onClick: () => setSearchColumn(name),
    };
  });
});

const updateInputValue = (event: Event) => {
  setSearchKey((event.target as HTMLInputElement).value);
};
const reset = () => {
  setSearchColumn(searchColumnNames.value[0]);
  setSearchKey('');
  navigate(1);
};
</script>

<template>
  <div class="flex flex-grow items-center relative rounded">

    <!-- <Button color-scheme="pink" is-rounded size="sm" left-icon="filter">
      Filters
    </Button> -->
  </div>
</template>
