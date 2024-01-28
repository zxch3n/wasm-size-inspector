import { ItemModel } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ItemWasm } from "twiggy-wasm-api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function itemWasmToItemModels(items: ItemWasm[]): ItemModel[] {
  const map: Map<bigint, ItemModel> = new Map();
  for (const item of items) {
    map.set(item.id, {
      id: item.id,
      name: item.name,
      children: [],
      parent: undefined,
      shallowSize: item.shallowSize,
      retainSize: item.retainSize,
      kind: item.kind,
    });
  }

  for (const item of items) {
    for (const child of item.children) {
      const c = map.get(child)!;
      const ansItem = map.get(item.id)!;
      ansItem.children.push(c);
      c.parent = ansItem;
    }
  }

  return Array.from(map.values()).filter((item) => item.parent === undefined);
}
