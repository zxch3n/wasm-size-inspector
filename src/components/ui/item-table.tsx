import { ItemModel } from "@/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./table";

import React, { SVGProps, useCallback, useMemo, useState } from "react";
import { itemWasmToItemModels } from "@/lib/utils";
import { Items } from "twiggy-wasm-api";

const INDENT_WIDTH = 32;

export interface Props {
  items: ItemModel[];
  totalSize: number;
}

type SortBy = "shallowSize" | "retainSize" | "retainSizeAsc" | "shallowSizeAsc";
export const ItemTable = ({ items, totalSize }: Props) => {
  const collapsedSetRef = React.useRef<Set<bigint>>(new Set());
  const setUpdateTrigger = useState(0)[1];
  const [sortBy, setSortBy] = useState<SortBy>("retainSize");
  const sortedItems = sort(items, sortBy);
  const onRowClick = useCallback(
    (item: ItemModel) => {
      if (item.children.length > 0) {
        collapsedSetRef.current.has(item.id)
          ? collapsedSetRef.current.delete(item.id)
          : collapsedSetRef.current.add(item.id);
        setUpdateTrigger((v) => v + 1);
      }
    },
    [setUpdateTrigger],
  );
  const flatRetainMode = (item: ItemModel, depth: number = 0, hide = false) => {
    const rows = [
      [
        <Row
          hide={hide}
          onClick={onRowClick}
          key={item.id}
          item={item}
          totalSize={totalSize}
          depth={depth}
          foldState={extractFoldState(item, collapsedSetRef.current)}
        />,
        item,
      ] as [JSX.Element, ItemModel],
    ];
    const shouldChildrenHide = hide || collapsedSetRef.current.has(item.id);
    const children = sort(item.children, sortBy);
    for (const c of children) {
      const arr = flatRetainMode(c, depth + 1, shouldChildrenHide);
      for (const c of arr) {
        rows.push(c);
      }
    }
    return rows;
  };

  const flatShallowMode = (item: ItemModel) => {
    const rows = [
      [
        <Row
          hide={false}
          onClick={onRowClick}
          key={item.id}
          item={item}
          totalSize={totalSize}
          depth={0}
          foldState={"none"}
        />,
        item,
      ] as [JSX.Element, ItemModel],
    ];
    for (const c of item.children) {
      const arr = flatShallowMode(c);
      for (const c of arr) {
        rows.push(c);
      }
    }
    return rows;
  };
  let rows: [JSX.Element, ItemModel][] = [];
  if (sortBy === "retainSize" || sortBy === "retainSizeAsc") {
    const flatItem = (item: ItemModel) => flatRetainMode(item, 0);
    rows = sortedItems.flatMap(flatItem);
  } else {
    rows = sortedItems.flatMap(flatShallowMode);
    rows.sort((a, b) => b[1].shallowSize - a[1].shallowSize);
    if (sortBy === "shallowSizeAsc") {
      rows.reverse();
    }
  }
  return (
    <Table className="text-gray-700 dark:text-gray-200">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px] px-0">
            <div
              className="flex cursor-pointer select-none flex-row items-center rounded-md px-3 hover:bg-gray-100/20 hover:text-gray-400"
              onClick={useCallback(
                () =>
                  setSortBy((r) => {
                    if (r === "shallowSize") {
                      return "shallowSizeAsc";
                    } else {
                      return "shallowSize";
                    }
                  }),
                [],
              )}
            >
              Shallow Bytes
              <MaterialSymbolsKeyboardArrowDown
                className="text-xl"
                style={{
                  color: sortBy.startsWith("shallowSize")
                    ? "#777"
                    : "transparent",
                  transform:
                    sortBy === "shallowSizeAsc" ? "rotate(180deg)" : "",
                }}
              />
            </div>
          </TableHead>
          <TableHead className="w-[80px]">Shallow Ratio</TableHead>
          <TableHead className="w-[80px] px-0">
            <div
              className="flex cursor-pointer select-none flex-row items-center rounded-md px-3 hover:bg-gray-100/20 hover:text-gray-400"
              onClick={useCallback(
                () =>
                  setSortBy((r) => {
                    if (r === "retainSize") {
                      return "retainSizeAsc";
                    } else {
                      return "retainSize";
                    }
                  }),
                [],
              )}
            >
              Retained Bytes
              <MaterialSymbolsKeyboardArrowDown
                className="text-xl"
                style={{
                  color: sortBy.startsWith("retainSize")
                    ? "#777"
                    : "transparent",
                  transform: sortBy === "retainSizeAsc" ? "rotate(180deg)" : "",
                }}
              />
            </div>
          </TableHead>
          <TableHead className="w-[80px]">Retained Ratio</TableHead>
          <TableHead className="w-[24px]"></TableHead>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{rows.map((x) => x[0])}</TableBody>
    </Table>
  );
};

export const WasmTable = React.memo(({ wasm }: { wasm: Uint8Array }) => {
  const [items, totalSize] = useMemo(() => {
    const items = Items.parse(wasm);
    const itemModels = itemWasmToItemModels(items.items());
    items.free();
    return [itemModels, wasm.length];
  }, [wasm]);
  return <ItemTable items={items} totalSize={totalSize} />;
});

const extractFoldState = (
  item: ItemModel,
  collapsedSet: Set<bigint>,
): "none" | "folded" | "expanded" => {
  if (item.children.length === 0) {
    return "none";
  }
  if (collapsedSet.has(item.id)) {
    return "folded";
  }
  return "expanded";
};

const Row = React.memo(
  ({
    item,
    totalSize,
    depth,
    onClick,
    foldState,
    hide,
  }: {
    item: ItemModel;
    hide: boolean;
    totalSize: number;
    depth: number;
    foldState: "none" | "folded" | "expanded";
    onClick: (item: ItemModel) => void;
  }) => {
    let icon: React.ReactNode;
    if (foldState === "none") {
      icon = (
        <span
          className="mr-5"
          style={{ paddingLeft: depth * INDENT_WIDTH }}
        ></span>
      );
    } else if (foldState === "folded") {
      icon = (
        <span
          className="mr-1 text-gray-400"
          style={{ paddingLeft: depth * INDENT_WIDTH }}
        >
          <MaterialSymbolsKeyboardArrowDown className="-rotate-90" />
        </span>
      );
    } else {
      icon = (
        <span
          className="mr-1 text-gray-400"
          style={{ paddingLeft: depth * INDENT_WIDTH }}
        >
          <MaterialSymbolsKeyboardArrowDown />
        </span>
      );
    }

    return (
      <TableRow style={{ display: hide ? "none" : "" }}>
        <TableCell className="py-1">{item.shallowSize}</TableCell>
        <TableCell className="py-1">
          {((item.shallowSize / totalSize) * 100).toFixed(2)}%
        </TableCell>
        <TableCell className="py-1">{item.retainSize}</TableCell>
        <TableCell className="py-1">
          {((item.retainSize / totalSize) * 100).toFixed(2)}%
        </TableCell>
        <TableCell className="py-1">
          <KindIcon kind={item.kind} />
        </TableCell>
        <TableCell
          onClick={useCallback(() => {
            onClick(item);
          }, [item, onClick])}
          className="cursor-pointer whitespace-nowrap py-1 text-xs"
          style={{ fontFamily: "monospace" }}
        >
          {icon}
          <span>{item.name}</span>
        </TableCell>
      </TableRow>
    );
  },
);

function sort(items: ItemModel[], sortBy: SortBy): ItemModel[] {
  const t = items.concat();
  t.sort((a, b) => {
    if (sortBy === "retainSizeAsc") {
      return a.retainSize - b.retainSize;
    }
    return -a[sortBy] + b[sortBy];
  });

  return t;
}

export function MaterialSymbolsKeyboardArrowDown(
  props: SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
      style={{ display: "inline-block", ...props.style }}
    >
      <path
        fill="currentColor"
        d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z"
      ></path>
    </svg>
  );
}

function KindIcon(props: { kind: ItemModel["kind"] }) {
  const [inner, color] = getInnerIcon(props.kind);
  return (
    <div
      className="flex h-5 w-5 items-center justify-center rounded bg-blue-400"
      style={{ backgroundColor: color as "blue" }}
      title={props.kind}
    >
      {inner}
    </div>
  );
}

function getInnerIcon(kind: ItemModel["kind"]) {
  switch (kind) {
    case "misc":
      return [<PhShapesFill className="text-gray-700" />, "#aba"];
    case "code":
      return [<PhCodeLight className="text-white" />, "#66f"];
    case "data":
      return [<MaterialSymbolsDatabase className="text-white" />, "#454545"];
    case "debug":
      return [<CarbonDebug />, "#f55"];
  }
}

function PhCodeLight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="M67.84 92.61L25.37 128l42.47 35.39a6 6 0 1 1-7.68 9.22l-48-40a6 6 0 0 1 0-9.22l48-40a6 6 0 0 1 7.68 9.22m176 30.78l-48-40a6 6 0 1 0-7.68 9.22L230.63 128l-42.47 35.39a6 6 0 1 0 7.68 9.22l48-40a6 6 0 0 0 0-9.22m-81.79-89a6 6 0 0 0-7.69 3.61l-64 176a6 6 0 0 0 3.64 7.64a6.15 6.15 0 0 0 2 .36a6 6 0 0 0 5.64-3.95l64-176a6 6 0 0 0-3.59-7.69Z"
      ></path>
    </svg>
  );
}

function CarbonDebug(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 32 32"
      {...props}
    >
      <path
        fill="currentColor"
        d="m29.83 20l.34-2l-5.17-.85v-4.38l5.06-1.36l-.51-1.93l-4.83 1.29A9 9 0 0 0 20 5V2h-2v2.23a8.81 8.81 0 0 0-4 0V2h-2v3a9 9 0 0 0-4.71 5.82L2.46 9.48L2 11.41l5 1.36v4.38L1.84 18l.32 2L7 19.18a8.9 8.9 0 0 0 .82 3.57l-4.53 4.54l1.42 1.42l4.19-4.2a9 9 0 0 0 14.2 0l4.19 4.2l1.42-1.42l-4.54-4.54a8.9 8.9 0 0 0 .83-3.57ZM15 25.92A7 7 0 0 1 9 19v-6h6ZM9.29 11a7 7 0 0 1 13.42 0ZM23 19a7 7 0 0 1-6 6.92V13h6Z"
      ></path>
    </svg>
  );
}

function MaterialSymbolsDatabase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 11q3.75 0 6.375-1.175T21 7q0-1.65-2.625-2.825T12 3Q8.25 3 5.625 4.175T3 7q0 1.65 2.625 2.825T12 11m0 2.5q1.025 0 2.563-.213t2.962-.687q1.425-.475 2.45-1.237T21 9.5V12q0 1.1-1.025 1.863t-2.45 1.237q-1.425.475-2.962.688T12 16q-1.025 0-2.562-.213T6.475 15.1q-1.425-.475-2.45-1.237T3 12V9.5q0 1.1 1.025 1.863t2.45 1.237q1.425.475 2.963.688T12 13.5m0 5q1.025 0 2.563-.213t2.962-.687q1.425-.475 2.45-1.237T21 14.5V17q0 1.1-1.025 1.863t-2.45 1.237q-1.425.475-2.962.688T12 21q-1.025 0-2.562-.213T6.475 20.1q-1.425-.475-2.45-1.237T3 17v-2.5q0 1.1 1.025 1.863t2.45 1.237q1.425.475 2.963.688T12 18.5"
      ></path>
    </svg>
  );
}

export function PhShapesFill(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="M111.59 181.47A8 8 0 0 1 104 192H24a8 8 0 0 1-7.59-10.53l40-120a8 8 0 0 1 15.18 0ZM208 76a52 52 0 1 0-52 52a52.06 52.06 0 0 0 52-52m16 68h-88a8 8 0 0 0-8 8v56a8 8 0 0 0 8 8h88a8 8 0 0 0 8-8v-56a8 8 0 0 0-8-8"
      ></path>
    </svg>
  );
}
