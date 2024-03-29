export interface DatatableProvision {
  getSelectionIndex: (item: any) => number;
  meta: Ref<DatatableMeta>;
  paginatedData: ComputedRef<Array<any>>;
  paginationLinks: ComputedRef<Array<number | null>>;
  search: Ref<DataTableSearch>;
  searchColumns: Array<DatatableSearchColumn>;
  searchColumnNames: ComputedRef<Array<string>>;
  selectable: boolean;
  selection: Ref<Array<any>>;
  showSearchColumns: boolean;
  sort: Ref<DatatableSort>;
  clearSelection: () => void;
  loadFromServer: () => void;
  searchOnServer: () => void;
  resetOnServer: () => void;
  navigate: (page: number) => void;
  next: () => void;
  prev: () => void;
  selectAll: (state: boolean) => void;
  setSearchColumn: (column: string) => void;
  setSearchKey: (key: string) => void;
  setSorting: (name: string) => void;
  toggleSelection: (item: any) => void;

  filterValues: Ref<Record<string, string | number | null>>;
  updateFilterValue: (key: string, value: string | number) => void;
}

export interface DatatableItem<TModel = any> {
  row: TModel;
  index: number;
  isSelected: boolean;
  loadFromServer: () => void;
}

export interface DatatableMeta {
  count: number;
  limit: number;
  page: number;
  pages: number;
  total: number;
}
export interface DatatableSort {
  column?: string;
  orderByAscending: boolean;
}
export interface DataTableSearch {
  key: string;
  column?: string;
}
export type DatatableSearchColumn = string | { title: string; name: string };
export type DatatableFilter = {
  slug: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'select';
  options?: Array<{ value?: string | number | null; title?: string }>;
  defaultValue?: any;
};
export type DatatablePaginationLink = {
  isActive?: boolean;
  isDisabled?: boolean;
  title: string | number;
  action?: () => void;
};
