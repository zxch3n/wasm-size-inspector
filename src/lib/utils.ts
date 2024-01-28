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
      collapse: false,
      children: [],
      shallowSize: item.shallowSize,
      retainSize: item.retainSize,
    });
  }

  for (const item of items) {
    for (const child of item.children) {
      map.get(item.id)!.children.push(map.get(child)!);
    }
  }

  return Array.from(map.values());
}
