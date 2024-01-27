export interface ItemWasm {
  id: number;
  name: string;
  children: number[];
  shallowSize: number;
  retainSize: number;
}

/**
 * ItemModel for UI
 */
export interface ItemModel {
  id: number;
  name: string;
  collapse: boolean;
  children: ItemModel[];
  shallowSize: number;
  retainSize: number;
}
