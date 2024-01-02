<script lang="ts" setup>
import { v4 } from 'uuid';

export interface Filter {
  title: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'date';
  value?: string | number | boolean | any;
}
export interface FilterItem {
  uuid: string;
  title: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'date';
  operator: string;
  requiresInput: boolean;
  value: string | number | boolean | any;
}

const props = withDefaults(
  defineProps<{
    filters?: Array<Filter>;
  }>(),
  {
    filters: () => [],
  }
);
const filters = computed<Array<Filter>>(() => {
  return props?.filters?.length
    ? props.filters
    : [
        {
          title: 'Date',
          name: 'date',
          type: 'date',
        },
        {
          title: 'Email',
          name: 'email',
          type: 'text',
        },
        {
          title: 'Name',
          name: 'name',
          type: 'text',
        },
        {
          title: 'Phone Number',
          name: 'phone',
          type: 'text',
        },
        {
          title: 'Date Of Birth',
          name: 'date_of_birth',
          type: 'date',
        },
      ];
});
const filterOptions = computed(() => {
  return filters.value.map(({ title, name }) => {
    return { value: name, title };
  });
});
const allOperators = [
  {
    title: 'Equals',
    name: 'eq',
    value: 'eq',
    filterTypes: ['text', 'number', 'select'],
    requiresInput: true,
  },
  {
    title: 'Not Equals',
    name: 'neq',
    value: 'neq',
    filterTypes: ['text', 'number', 'select'],
    requiresInput: true,
  },
  {
    title: 'Contains',
    name: 'contains',
    value: 'contains',
    filterTypes: ['text'],
    requiresInput: true,
  },
  {
    title: 'Does not contain',
    name: 'not_contains',
    value: 'not_contains',
    filterTypes: ['text'],
    requiresInput: true,
  },
  {
    title: 'Starts with',
    name: 'starts_with',
    value: 'starts_with',
    filterTypes: ['text'],
    requiresInput: true,
  },
  {
    title: 'Ends with',
    name: 'ends_with',
    value: 'ends_with',
    filterTypes: ['text'],
    requiresInput: true,
  },
  {
    title: 'Greater than',
    name: 'gt',
    value: 'gt',
    filterTypes: ['number'],
    requiresInput: true,
  },
  {
    title: 'Less than',
    name: 'lt',
    value: 'lt',
    filterTypes: ['number'],
    requiresInput: true,
  },
  {
    title: 'Greater than or equal to',
    name: 'gte',
    value: 'gte',
    filterTypes: ['number'],
    requiresInput: true,
  },
  {
    title: 'Less than or equal to',
    name: 'lte',
    value: 'lte',
    filterTypes: ['number'],
    requiresInput: true,
  },
  {
    title: 'Is empty',
    name: 'is_empty',
    value: 'is_empty',
    filterTypes: ['text', 'number', 'select', 'date'],
    requiresInput: false,
  },
  {
    title: 'Is not empty',
    name: 'is_not_empty',
    value: 'is_not_empty',
    filterTypes: ['text', 'number', 'select', 'date'],
    requiresInput: false,
  },
  {
    title: 'Is null',
    name: 'is_null',
    value: 'is_null',
    filterTypes: ['text', 'number', 'select', 'date'],
    requiresInput: false,
  },
  {
    title: 'Is not null',
    name: 'is_not_null',
    value: 'is_not_null',
    filterTypes: ['text', 'number', 'select', 'date'],
    requiresInput: false,
  },
  {
    title: 'Is in',
    name: 'is_in',
    value: 'is_in',
    filterTypes: ['text', 'number'],
    requiresInput: true,
  },
  {
    title: 'Is not in',
    name: 'is_not_in',
    value: 'is_not_in',
    filterTypes: ['text', 'number'],
    requiresInput: true,
  },
  {
    title: 'Is between',
    name: 'is_between',
    value: 'is_between',
    filterTypes: ['text', 'number'],
    requiresInput: true,
  },
  {
    title: 'Is not between',
    name: 'is_not_between',
    value: 'is_not_between',
    filterTypes: ['text', 'number'],
    requiresInput: true,
  },
  {
    title: 'Is before',
    name: 'is_before',
    value: 'is_before',
    filterTypes: ['date'],
    requiresInput: true,
  },
  {
    title: 'Is after',
    name: 'is_after',
    value: 'is_after',
    filterTypes: ['date'],
    requiresInput: true,
  },
  {
    title: 'Is today',
    name: 'is_today',
    value: 'is_today',
    filterTypes: ['date'],
    requiresInput: true,
  },
  {
    title: 'Is not today',
    name: 'is_not_today',
    value: 'is_not_today',
    filterTypes: ['date'],
    requiresInput: true,
  },
];
const getOperators = (filterItem: FilterItem) => {
  return allOperators
    .filter((operator) => operator.filterTypes.includes(filterItem.type))
    .map(({ title, name }) => ({ value: name, title }));
};

const filterItems = ref<Array<FilterItem>>([]);
const addFilterItem = () => {
  filterItems.value.push({
    uuid: v4(),
    title: 'Select a filter',
    name: '',
    type: 'text',
    operator: 'eq',
    requiresInput: true,

    value: '',
  });
};
const removeFilterItem = (index: number) => {
  filterItems.value.splice(index, 1);
};

const setItemFilter = (index: number, filterName: string) => {
  const filter = filters.value.find((filter) => filter.name === filterName);
  if (!filter) return;
  filterItems.value = [
    ...filterItems.value.slice(0, index),
    {
      ...filterItems.value[index],
      name: filter.name,
      type: filter.type,
      value: filter.value ?? '',
    },
    ...filterItems.value.slice(index + 1),
  ];
};
const setItemOperator = (index: number, operatorName: string) => {
  const operator = allOperators.find(
    (operator) => operator.name === operatorName
  );
  if (!operator) return;
  filterItems.value = [
    ...filterItems.value.slice(0, index),
    {
      ...filterItems.value[index],
      operator: operator.name,
      requiresInput: operator.requiresInput,
    },
    ...filterItems.value.slice(index + 1),
  ];
};
const setItemValue = (index: number, value: string | number | boolean) => {
  filterItems.value = filterItems.value.map((item, _index) => {
    if (_index === index && item.requiresInput) {
      return {
        ...item,
        value,
      };
    }
    return item;
  });
  filterItems.value[index] = {
    ...filterItems.value[index],
    value,
  };
};

const showFilters = ref(false);
const setShowFilters = (value: boolean) => (showFilters.value = value);
const toggleShowFilters = () => (showFilters.value = !showFilters.value);
</script>

<template>
  <div
    class="border border-pink-200 py-8 px-4 rounded-xl md:px-8 flex flex-col gap-4"
  >
    <div class="flex items-start gap-2">
      <Button
        v-if="filterItems.length < 1"
        size="sm"
        color-scheme="pink"
        is-rounded
        left-icon="filter"
        right-icon="plus"
        @click.prevent="
          () => {
            addFilterItem();
            setShowFilters(true);
          }
        "
      >
        Add Filter
      </Button>
      <template v-else>
        <Button
          size="sm"
          color-scheme="pink"
          left-icon="filter"
          right-icon="plus"
          is-rounded
          @click.prevent="
            () => {
              addFilterItem();
              setShowFilters(true);
            }
          "
        >
          {{ filterItems.length }}
        </Button>
        <Button
          size="sm"
          color-scheme="gray:soft"
          left-icon="eye"
          is-rounded
          @click.prevent="toggleShowFilters"
        />
        {{ showFilters ? 'show' : 'hide' }}
      </template>
    </div>
    <div>
      <div
        class="overflow-hidden duration-300 p-1"
        :class="{ 'max-h-0': !showFilters, 'max-h-[100dvh]': showFilters }"
      >
        <div>
          <div class="flex flex-col gap-4">
            <template
              v-for="(filterItem, index) in filterItems"
              :key="filterItem.uuid"
            >
              <div class="flex items-end gap-4">
                <FormGroup
                  class="input-sm input-rounded flex-shrink-0"
                  type="select"
                  :options="filterOptions"
                  label="Select a filter"
                  :model-value="filterItem.name"
                  @update:model-value="setItemFilter(index, $event)"
                />
                <FormGroup
                  class="input-sm input-rounded flex-shrink-0"
                  type="select"
                  :options="getOperators(filterItem)"
                  label="Select an operator"
                  :model-value="filterItem.operator"
                  @update:model-value="setItemOperator(index, $event)"
                />
                <FormInput
                  v-if="filterItem.requiresInput"
                  class="input-sm input-rounded flex-shrink-0"
                  :type="filterItem.type"
                  placeholder="Enter value"
                  :model-value="filterItem.value"
                  @update:model-value="setItemValue(index, $event)"
                />

                <Button
                  size="sm"
                  color-scheme="red"
                  is-rounded
                  left-icon="filter"
                  right-icon="minus"
                  @click.prevent="removeFilterItem(index)"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
