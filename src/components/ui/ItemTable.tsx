import { ItemModel } from "@/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./table";

import React, { SVGProps, useState } from "react";

const INDENT_WIDTH = 32;

export interface Props {
  items: ItemModel[];
  totalSize: number;
}

export const ItemTable = ({ items, totalSize }: Props) => {
  const collapsedSetRef = React.useRef<Set<bigint>>(new Set());
  const setUpdateTrigger = useState(0)[1];
  const [sortBy, setSortBy] = useState<SortBy>("retainSize");
  const sortedItems = sort(items, sortBy);
  const flat = (item: ItemModel, depth: number = 0) => {
    const rows = [
      <Row
        onClick={() => {
          if (item.children.length > 0) {
            collapsedSetRef.current.has(item.id)
              ? collapsedSetRef.current.delete(item.id)
              : collapsedSetRef.current.add(item.id);
            setUpdateTrigger((v) => v + 1);
          }
        }}
        key={item.id}
        item={item}
        totalSize={totalSize}
        depth={depth}
        collapsedSet={collapsedSetRef}
      />,
    ];
    if (!collapsedSetRef.current.has(item.id)) {
      const children = sort(item.children, sortBy);
      for (const c of children) {
        const arr = flat(c, depth + 1);
        for (const c of arr) {
          rows.push(c);
        }
      }
    }
    return rows;
  };

  const flatItem = (item: ItemModel) => flat(item, 0);
  const rows = sortedItems.flatMap(flatItem);
  return (
    <Table className="max-w-[1100px] text-gray-700">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Shallow Bytes</TableHead>
          <TableHead className="w-[80px]">Shallow Ratio</TableHead>
          <TableHead className="w-[80px]">
            <div
              className="cursor-pointer select-none text-sm hover:text-gray-400"
              onClick={() =>
                setSortBy((r) => {
                  if (r === "retainSize") {
                    return "retainSizeAsc";
                  } else {
                    return "retainSize";
                  }
                })
              }
            >
              Retained Bytes
              <MaterialSymbolsKeyboardArrowDown
                className="ml-1"
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
      <TableBody>{rows}</TableBody>
    </Table>
  );
};

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

function Row({
  item,
  totalSize,
  depth,
  onClick,
  collapsedSet,
}: {
  item: ItemModel;
  totalSize: number;
  depth: number;
  onClick: () => void;
  collapsedSet: { current: Set<bigint> };
}) {
  const foldState = extractFoldState(item, collapsedSet.current);
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
    <TableRow>
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
        onClick={onClick}
        className="cursor-pointer select-none whitespace-nowrap py-1"
      >
        {icon}
        <span>{item.name}</span>
      </TableCell>
    </TableRow>
  );
}

type SortBy = "shallowSize" | "retainSize" | "retainSizeAsc";
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
      return [<CodiconSymbolMisc className="text-white" />, "#89a"];
    case "code":
      return [<PhCodeLight className="text-white" />, "#66f"];
    case "data":
      return [<MaterialSymbolsDatabase className="text-white" />, "#444"];
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

function CodiconSymbolMisc(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4 2h8v4c.341.035.677.112 1 .23V1H3v8.48l1-1.75zm2.14 8L5 8L4 9.75L3.29 11L1 15h8l-2.29-4zm-3.42 4l1.72-3L5 10l.56 1l1.72 3zm6.836-6.41a3.5 3.5 0 1 1 3.888 5.82a3.5 3.5 0 0 1-3.888-5.82m.555 4.989a2.5 2.5 0 1 0 2.778-4.157a2.5 2.5 0 0 0-2.778 4.157"
        clipRule="evenodd"
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
