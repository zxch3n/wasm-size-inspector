import { ItemTable, Props } from "./ItemTable";
import { useMemo } from "react";
import { Items } from "twiggy-wasm-api";
import { itemWasmToItemModels } from "@/lib/utils";
import wasm from "../..//assets/hello.wasm?raw-binary";

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
      collapse: false,
      name: "level 0",
      retainSize: 100,
      shallowSize: 100,
      children: [],
    },
    {
      id: 1n,
      collapse: false,
      name: "level 0 Debug",
      retainSize: 200,
      shallowSize: 23,
      children: [
        {
          id: 12n,
          collapse: false,
          name: "function",
          retainSize: 200,
          shallowSize: 111,
          children: [
            {
              id: 14n,
              collapse: false,
              name: "function",
              retainSize: 200,
              shallowSize: 111,
              children: [],
            },
          ],
        },
        {
          id: 23n,
          collapse: false,
          name: "functiona asdfadsfdsa",
          retainSize: 20,
          shallowSize: 31,
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

export const SqliteTable = () => {
  const [items, totalSize] = useMemo(() => {
    const raw = base64ToUint8Array(wasm);
    console.log(raw);
    const items = Items.parse(raw);
    const itemModels = itemWasmToItemModels(items.items());
    items.free();
    const totalSize = itemModels.reduce(
      (acc, item) => acc + item.shallowSize,
      0,
    );
    return [itemModels, totalSize];
  }, []);
  return <ItemTable items={items} totalSize={totalSize} />;
};
