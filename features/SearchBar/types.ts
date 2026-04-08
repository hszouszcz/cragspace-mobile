export interface SearchFilterMeta {
  id: string;
  label: string;
  value: string;
  group?: string;
  icon?: string;
  analyticsKey?: string;
}

export interface SearchContextConfig {
  contextId: string;
  placeholder: string;
  filters: SearchFilterMeta[];
  initialQuery?: string;
  initialSelectedValues?: string[];
}

export interface SearchAppliedFiltersPayload {
  contextId: string;
  query: string;
  selectedValues: string[];
  selectedFilters: SearchFilterMeta[];
}
