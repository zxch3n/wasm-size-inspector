import { ItemTable, Props } from "./ItemTable";
import { useMemo } from "react";
import { Items } from "twiggy-wasm-api";
import { itemWasmToItemModels } from "@/lib/utils";
import wasm from "../..//assets/hello.wasm?raw-binary";
import loroWasm from "../..//assets/loro.wasm?raw-binary";

export default {
  title: "Components/ItemTable",
  component: ItemTable,
  argTypes: {},
};

const Template = (args: Props) => <ItemTable {...args} />;

export const Default = Template.bind(null, {
  items: [
    {
      id: 0n,
      name: "level 0",
      retainSize: 100,
      shallowSize: 100,
      kind: "code",
      children: [],
    },
    {
      id: 1n,
      name: "level 0 Debug",
      retainSize: 200,
      shallowSize: 23,
      kind: "code",
      children: [
        {
          id: 12n,
          name: "function",
          retainSize: 200,
          shallowSize: 111,
          kind: "code",
          children: [
            {
              id: 14n,
              name: "function",
              retainSize: 200,
              shallowSize: 111,
              kind: "code",
              children: [],
            },
          ],
        },
        {
          id: 23n,
          name: "functiona asdfadsfdsa",
          retainSize: 20,
          shallowSize: 31,
          kind: "code",
          children: [],
        },
      ],
    },
  ],
  totalSize: 1000,
} as Props);

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export const HelloWasmTable = () => {
  const [items, totalSize] = useMemo(() => {
    const raw = base64ToUint8Array(wasm);
    const items = Items.parse(raw);
    const itemModels = itemWasmToItemModels(items.items());
    items.free();
    return [itemModels, raw.length];
  }, []);
  return <ItemTable items={items} totalSize={totalSize} />;
};

export const LoroWasmTable = () => {
  const [items, totalSize] = useMemo(() => {
    const raw = base64ToUint8Array(loroWasm);
    const items = Items.parse(raw);
    const itemModels = itemWasmToItemModels(items.items());
    items.free();
    return [itemModels, raw.length];
  }, []);
  return <ItemTable items={items} totalSize={totalSize} />;
};
