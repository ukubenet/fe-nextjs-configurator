export interface App {
  AppName: string
  Catalogs: string[]
  Events: string[]
}

export interface CatalogItem {
  entityName: string;
  entityType: number;
  identifier: string;
  attributes: Record<string, string>;
  transactions: null;
}

export interface EventItem {
  entityName: string;
  entityType: number;
  identifier: string;
  attributes: Record<string, string>;
  transactions: null;
}

export interface Metadata {
    entityName: string,
    attributes: [string, any][],
    // templates: string,
    // search: any,
    // transactions: [],
};

export type EditMode = 'edit' | 'add'