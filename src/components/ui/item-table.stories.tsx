import { ItemTable, Props, WasmTable } from "./item-table";
import { useMemo } from "react";

import helloWasm from "../../assets/hello.wasm?raw-binary";
import loroWasm from "../../assets/loro.wasm?raw-binary";
import { base64ToUint8Array } from "@/lib/utils";

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

export const HelloWasmTable = () => {
  const raw = useMemo(() => {
    const raw = base64ToUint8Array(helloWasm);
    return raw;
  }, []);
  return <WasmTable wasm={raw} />;
};

export const LoroWasmTable = () => {
  const raw = useMemo(() => {
    const raw = base64ToUint8Array(loroWasm);
    return raw;
  }, []);
  return <WasmTable wasm={raw} />;
};
