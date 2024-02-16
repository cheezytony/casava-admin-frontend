<script lang="ts" setup generic="TModel extends Record<string, any>">
import { ref } from 'vue';
import type { HTTPPaginatedResponse } from '~/types';
import { useReactiveApi } from '~/utils/hooks/api-reactive';
import type {
  DatatableProvision,
  DataTableSearch,
  DatatableSearchColumn,
  DatatableFilter,
  DatatableMeta,
  DatatableSort,
  DatatableItem,
} from '~~/types/components';
import type { ServiceNames } from '~~/utils/hooks/api';

interface Filter {
  name: string;
  label: string;
  type: 'number' | 'string' | 'select' | 'json' | 'date';
  options?: Array<{ value: string; label: string }>;
}

defineExpose();
const emit = defineEmits<{
  (e: 'update:activeFilters', value: string[]): void;
  (e: 'update:searchColumn', value: DatatableSearchColumn): void;
  (e: 'update:searchKey', value: string): void;
  (e: 'update:selection', value: TModel[]): void;
}>();
const props = withDefaults(
  defineProps<{
    activeFilters?: string[];
    baseUrl?: string;
    data?: TModel[];
    filterable?: boolean;
    filters?: Array<DatatableFilter>;
    isLoading?: boolean;
    limitable?: boolean;
    limit?: number;
    model?: TModel;
    orderBy?: string;
    orderByAscending?: boolean;
    page?: number;
    paginatable?: boolean;
    searchable?: boolean;
    searchColumn?: string;
    searchColumns?: Array<DatatableSearchColumn>;
    searchKey?: string;
    selection?: TModel[];
    selectable?: boolean;
    service?: ServiceNames;
    showSearchColumns?: boolean;
    uniqueKey?: string;
    url?: string;
  }>(),
  {
    activeFilters: () => [],
    data: () => [],
    filterable: true,
    filters: () => [],
    isLoading: false,
    limitable: true,
    limit: 10,
    orderByAscending: true,
    page: 1,
    paginatable: true,
    searchable: true,
    searchColumns: () => [],
    searchKey: '',
    selectable: false,
    showSearchColumns: true,
  }
);

const windowWidth = ref(0);
const isSmallScreen = computed(() => windowWidth.value < 768);
const handleResize = () => (windowWidth.value = window.innerWidth);
onMounted(() => {
  windowWidth.value = window.innerWidth;
  window.addEventListener('resize', handleResize);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
const mode = computed(() => (props.url ? 'server' : 'local'));

// ========================================================================================================================
// Pagination
// ========================================================================================================================
const meta = reactive<DatatableMeta>({
  count: 0,
  limit: props.limit,
  page: props.page,
  pages: 0,
  total: 0,
});
const start = computed<number>(() => meta.limit * (meta.page - 1));
const end = computed<number>(() => meta.limit * meta.page);
const paginationLinks = computed(() => {
  const links = [];

  // Set default maxLinks
  const maxLinks = Math.min(isSmallScreen.value ? 1 : 3, meta.pages);

  // Calculate start and end links considering the maxLinks
  let start = meta.page - Math.floor(maxLinks / 2);
  let end = meta.page + Math.floor(maxLinks / 2);

  // Correct start and end if they're out of boundaries
  if (start <= 0) {
    end -= start - 1;
    start = 1;
  }
  if (end > meta.pages) {
    start -= end - meta.pages;
    end = meta.pages;
  }
  start = Math.max(start, 1);

  // Add first page if not already visible
  if (start > 1) {
    links.push(1);
    // Add dots if there's a gap after the first page
    if (start > 2) {
      links.push(null);
    }
  }

  // Add visible pages
  for (let i = start; i <= end; i++) {
    links.push(i);
  }

  // Add last page if not already visible
  if (end < meta.pages) {
    // Add dots if there's a gap before the last page
    if (end < meta.pages - 1) {
      links.push(null);
    }
    links.push(meta.pages);
  }

  return links;
});
const paginatedData = computed(() => {
  const items =
    mode.value === 'server'
      ? serverPaginatedItems.value
      : locallyPaginatedItems.value;

  return items.map((row, index) => ({
    row,
    index,
    isSelected: getSelectionIndex(row) > -1,
  }));
});
const limits = [10, 20, 25, 30, 50, 75, 100];
const updateLimit = (limit: number) => {
  meta.limit = limit;
  navigate(1);
  updateLocalMeta();
};
const next = () => {
  if (meta.page >= meta.pages) return;
  meta.page++;
  if (mode.value === 'server') loadFromServer();
};
const prev = () => {
  if (meta.page <= 0) return;
  meta.page--;
  if (mode.value === 'server') loadFromServer();
};
const navigate = (page: number) => {
  if (page > meta.pages || page < 0) return;
  meta.page = page;
  if (mode.value === 'server') loadFromServer();
};
watch([() => props.limit, () => props.page], ([limit, page]) => {
  meta.limit = limit;
  meta.page = page;
  if (mode.value === 'server') loadFromServer();
});
// ========================================================================================================================

// ========================================================================================================================
// Sorting.
// ========================================================================================================================

const filterValues = ref(
  props.filters.reduce(
    (obj, filter) => ({ ...obj, [filter.slug]: filter.defaultValue ?? '' }),
    {} as Record<string, string | number | null>
  )
);
const updateFilterValue = (slug: string, value: string | number | null) => {
  filterValues.value[slug] = value;
  if (mode.value === 'server') navigate(1);
};
watch(
  () => props.filters,
  (filters) => {
    filterValues.value = filters.reduce(
      (obj, filter) => ({ ...obj, [filter.slug]: filter.defaultValue ?? '' }),
      filterValues.value
    );
  }
);
// ========================================================================================================================

// ========================================================================================================================
// Sorting.
// ========================================================================================================================

const sort = reactive<DatatableSort>({
  column: props.orderBy,
  orderByAscending: props.orderByAscending,
});
const setSorting = (column: string) => {
  (() => {
    if (column === sort.column) {
      if (!sort.orderByAscending) {
        return (sort.column = undefined);
      }
      return (sort.orderByAscending = !sort.orderByAscending);
    }

    sort.column = column;
    sort.orderByAscending = true;
  })();

  if (mode.value === 'server') navigate(1);
};
watch(
  [() => props.orderBy, () => props.orderByAscending],
  ([orderBy, orderByAscending]) => {
    sort.column = orderBy;
    sort.orderByAscending = orderByAscending;
    if (mode.value === 'server') navigate(1);
  }
);
// ========================================================================================================================

// ========================================================================================================================
// Searching
// ========================================================================================================================

const searchColumnNames = computed(() => {
  return props.searchColumns.map((column) => {
    return typeof column === 'string' ? column : column.name;
  });
});
const search = reactive<DataTableSearch>({
  key: props.searchKey,
  column: props.searchColumn ?? searchColumnNames.value[0],
});
const searchExpression = computed(() => new RegExp(search.key, 'i'));
const setSearchKey = (key: string) => {
  emit('update:searchKey', (search.key = key));
};
const setSearchColumn = (column: string) => {
  emit('update:searchColumn', (search.column = column));
};
const resetOnServer = () => {
  if (!props.url) return;

  meta.page = 1;
  search.key = '';
  search.column = searchColumnNames.value[0];
  loadFromServer();
};
const searchOnServer = () => {
  if (!props.url) return;

  meta.page = 1;
  loadFromServer();
};
watch(
  [() => props.searchKey, () => props.searchColumn],
  ([searchKey, searchColumn]) => {
    search.key = searchKey;
    search.column = searchColumn;
  }
);
// ========================================================================================================================

// ========================================================================================================================
// Selecting
// ========================================================================================================================
const selection = ref(props.selection ?? []) as Ref<TModel[]>;
// const isAllSelected = computed(() => {
//   // return selection.value.every();
// });
const getSelectionIndex = (item: TModel) => {
  return selection.value.findIndex((selectedItem) => {
    if (props.uniqueKey) {
      const uniqueKey = props.uniqueKey;
      return selectedItem[uniqueKey] === item[uniqueKey];
    }

    return selectedItem === item;
  });
};
const selectAll = (state: boolean) =>
  mode.value === 'server'
    ? selectAllFromServer(state)
    : selectAllFromLocal(state);
const toggleSelection = (item: TModel) => {
  const index = getSelectionIndex(item);
  index > -1 ? selection.value.splice(index, 1) : selection.value.push(item);

  emit('update:selection', selection.value);
};
const clearSelection = () => emit('update:selection', (selection.value = []));
watch(
  () => props.selection,
  (value) => {
    selection.value = value ?? [];
  }
);
// ========================================================================================================================

// ========================================================================================================================
// Local Data Control
// ========================================================================================================================
const localItems = ref(props.data) as Ref<TModel[]>;
const localSearch = (items: TModel[]) => {
  if (!search.key || !props.searchColumns.length) return items;
  return items.filter((item) => {
    // Search with one column.
    if (search.column) {
      return searchExpression.value.test(item[search.column]);
    }
    // Search will all searchColumns. Only allowed with local search.
    return props.searchColumns.some((column) => {
      const key = typeof column === 'string' ? column : column.name;
      return searchExpression.value.test(item[key]);
    });
  });
};
const localSort = (items: TModel[]) => {
  if (!sort.column) return items;
  const column = sort.column;
  return [...items].sort((itemA, itemB) => {
    const columnA = itemA[column];
    const columnB = itemB[column];
    if (typeof columnA === 'string' && typeof columnB === 'string') {
      return sort.orderByAscending
        ? columnA.localeCompare(columnB)
        : columnB.localeCompare(columnA);
    }
    if (typeof columnA === 'number' && typeof columnB === 'number') {
      return sort.orderByAscending ? columnA - columnB : columnB - columnA;
    }
    return 0;
  });
};
const locallyModifiedItems = computed(() => {
  return localSort(localSearch([...localItems.value]));
});
const locallyPaginatedItems = computed(() => {
  return locallyModifiedItems.value.slice(start.value, end.value);
});
const updateLocalMeta = () => {
  meta.total = locallyModifiedItems.value.length;
  // meta.limit = props.limit;
  meta.page = 1;
  meta.pages = Math.ceil(meta.total / meta.limit);
};
const selectAllFromLocal = (state: boolean) => {
  return emit(
    'update:selection',
    (selection.value = state ? [...localItems.value] : [])
  );
};
watch(
  () => props.data,
  (data) => {
    localItems.value = data;
    updateLocalMeta();
  }
);
watch(locallyModifiedItems, () => {
  if (mode.value === 'local') updateLocalMeta();
});
onMounted(() => {
  if (props.data.length && mode.value === 'local') updateLocalMeta();
});
// ========================================================================================================================

// ========================================================================================================================
// Server Data Control
// ========================================================================================================================
const controller = ref(new AbortController());
const serverItems = ref([]) as Ref<TModel[]>;
const serverPaginatedItems = computed(() => serverItems.value);
const selectAllFromServer = (state: boolean) => {
  return emit(
    'update:selection',
    (selection.value = state ? [...serverItems.value] : [])
  );
};
const serverQuery = computed(() => {
  return {
    // search_value: search.key,
    // search_column: search.column,
    sort_column: sort.column,
    sort_order: sort.orderByAscending ? 'asc' : 'desc',
    page: meta.page,
    limit: meta.limit,
    ...filterValues.value,
  };
});
const { isLoading, error, config, load } = useReactiveApi<
  TModel[],
  HTTPPaginatedResponse<TModel>
>({
  baseURL: props.baseUrl,
  url: props.url ?? '',
  authorize: true,
  autoLoad: false,
  initialLoadingState: false,
  signal: controller.value.signal,
  service: props.service,
  onSuccess: (response) => {
    if (!response?.data) return;
    const { data } = response;
    serverItems.value = data.data || [];
    const { from, to, per_page, current_page, last_page, total } =
      response.data.meta!;
    meta.count = to - from + 1;
    meta.limit = per_page;
    meta.page = current_page;
    meta.pages = last_page;
    meta.total = total;
  },
});
const loadFromServer = async () => {
  if (isLoading.value) {
    controller.value.abort();
    controller.value = new AbortController();
  }

  config.value.params = serverQuery.value;

  await load();
};
onMounted(() => {
  if (props.url) loadFromServer();
});
// ========================================================================================================================

const isDataLoading = computed(() => {
  return mode.value === 'server' ? isLoading.value : props.isLoading;
});

const getSlotRow = (row: any): DatatableItem => {
  return row;
};

provide<DatatableProvision>('datatable', {
  getSelectionIndex,
  searchColumns: props.searchColumns,
  searchColumnNames,
  selectable: props.selectable,
  selection,
  showSearchColumns: props.showSearchColumns,
  paginatedData,
  paginationLinks,
  ...toRefs(
    reactive({
      meta,
      search,
      sort,
    })
  ),
  setSearchKey,
  setSearchColumn,
  next,
  prev,
  navigate,
  clearSelection,
  searchOnServer,
  resetOnServer,
  loadFromServer,
  selectAll,
  setSorting,
  toggleSelection,

  filterValues,
  updateFilterValue,
});
</script>

<template>
  <div class="flex flex-col gap-6 max-w-full">
    <div v-if="paginatable">
      <div
        class="bg-gray-50 flex flex-wrap gap-4 items-center justify-between px-2 py-4 rounded-t md:gap-10 md:px-4"
      >
        <div class="flex items-center gap-2">
          <span class="flex-shrink-0 font-medium text-gray-500 text-sm">
            Items per page:
          </span>
          <div class="max-w-[100px]">
            <FormSelect
              size="sm"
              :options="limits"
              :model-value="meta.limit"
              @update:model-value="updateLimit"
            />
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            class="border px-4 py-2 rounded text-sm border-gray-400 hover:bg-gray-100 hover:border-black"
            :class="[meta.page <= 1 && 'opacity-25 pointer-events-none']"
            type="button"
            :disabled="meta.page <= 1"
            @click.prevent="navigate(meta.page - 1)"
          >
            &lt;
          </button>
          <template :key="index" v-for="(link, index) in paginationLinks">
            <span v-if="link === null" class="px-1">...</span>
            <button
              v-else
              class="border px-4 py-2 rounded text-sm"
              :class="[
                meta.page === link
                  ? 'bg-black border-black text-white'
                  : 'border-gray-400 hover:bg-gray-100 hover:border-black',
              ]"
              type="button"
              :disabled="meta.page === link"
              v-html="link"
              @click.prevent="navigate(link)"
            />
          </template>
          <button
            class="border px-4 py-2 rounded text-sm border-gray-400 hover:bg-gray-100 hover:border-black"
            :class="[
              meta.page >= meta.pages && 'opacity-25 pointer-events-none',
            ]"
            type="button"
            :disabled="meta.page >= meta.pages"
            @click.prevent="navigate(meta.page + 1)"
          >
            &gt;
          </button>
        </div>
      </div>
      <div class="bg-white px-2 py-2 rounded-b md:px-4">
        <div class="font-medium text-gray-500 text-sm">
          <template v-if="paginatedData.length">
            Showing {{ start + 1 }} to
            {{ end > meta.total ? meta.total : end }} of
            {{ meta.total }}
          </template>
          <template v-else>---</template>
        </div>
      </div>
    </div>
    <div
      v-if="$slots.cta || searchable"
      class="flex flex-wrap gap-x-12 gap-y-2 items-center"
    >
      <div v-if="$slots.cta" class="md:ml-auto md:order-3">
        <slot name="cta" />
      </div>
      <DatatableSearch />
    </div>
    <DatatableFilter :filters="filters" />
    <slot
      name="table"
      :error="error"
      :is-loading="isDataLoading"
      :paginated-data="paginatedData"
    >
      <DatatableLoader v-if="isDataLoading" />
      <ServerError v-else-if="error" :error="error" />
      <DatatableEmpty v-else-if="!paginatedData.length" />
      <div
        class="border border-gray-300 flex items-center justify-center min-h-[20rem] rounded-lg"
        v-else-if="!paginatedData.length"
      >
        <p>There are no results to display</p>
      </div>
      <div
        v-else
        class="border border-gray-100 rounded-xl overflow-x-clip w-full"
      >
        <div class="overflow-x-scroll w-full">
          <table class="border-collapse whitespace-nowrap w-full">
            <thead>
              <tr class="bg-gray-50">
                <DatatableTH v-if="selectable">
                  <FormCheckbox class="mb-0" @update:modelValue="selectAll" />
                </DatatableTH>
                <slot name="heading" />
              </tr>
            </thead>
            <tbody>
              <template v-for="(row, index) in paginatedData">
                <slot v-bind="{ ...row, loadFromServer }" />
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </slot>
  </div>
</template>
