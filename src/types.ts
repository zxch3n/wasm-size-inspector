/**
 * ItemModel for UI
 */
export interface ItemModel {
  id: bigint;
  name: string;
  children: ItemModel[];
  parent?: ItemModel | undefined;
  shallowSize: number;
  retainSize: number;
  kind: "misc" | "code" | "data" | "debug";
}

export interface WasmFile {
  name: string;
  binary: Uint8Array;
  lastModified: number;
  importedTime: number;
}
