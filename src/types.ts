/**
 * ItemModel for UI
 */
export interface ItemModel {
  id: bigint;
  name: string;
  children: ItemModel[];
  parent: ItemModel | undefined;
  shallowSize: number;
  retainSize: number;
}
