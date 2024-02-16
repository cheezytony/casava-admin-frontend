<script lang="ts" setup>
import type { DatatableFilter, DatatableProvision } from '~/types';

const props = withDefaults(defineProps<{ filters?: Array<DatatableFilter> }>(), {
  filters: () => [],
});

const { filterValues, updateFilterValue, } = inject<DatatableProvision>('datatable')!;
const isOpen = ref(false);
const toggleIsOpen = () => (isOpen.value = !isOpen.value);
</script>

<template>
  <div>
    <Button
      color-scheme="pink"
      class="mb-4"
      left-icon="filter"
      :right-icon="isOpen ? 'caret-up' : 'caret-down'"
      size="sm"
      is-rounded
      @click="toggleIsOpen"
    >
      Filters
    </Button>
    <div
      class="grid duration-300 overflow-hidden p-px -m-px"
      :class="[isOpen ? 'max-h-screen' : 'max-h-0']"
    >
      <div class="flex flex-wrap gap-4">
        <template
          v-for="({ label, type, options, placeholder, slug }, filterIndex) in filters"
          :key="filterIndex"
        >
          <FormGroup
            class="input-sm"
            size="sm"
            v-bind="{ label, type, options, placeholder, name: slug }"
            :model-value="filterValues[slug]"
            @update:model-value="updateFilterValue(slug, $event)"
          />
        </template>
      </div>
    </div>
  </div>
</template>
