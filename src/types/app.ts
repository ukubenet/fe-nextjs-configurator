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
