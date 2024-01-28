export { ItemWasm } from "twiggy-wasm-api";

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
