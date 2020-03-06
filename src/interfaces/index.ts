export interface Store {
  storeName: string;
  autoIncrement?: boolean;
  keyPath?: string;
  data?: Array<Record<string, any>>;
}
