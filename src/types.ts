/**
 * ItemModel for UI
 */
export interface ItemModel {
  id: bigint;
  name: string;
  collapse: boolean;
  children: ItemModel[];
  shallowSize: number;
  retainSize: number;
}
