import { ItemModel } from "@/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./table";
import { Button } from "./button";

import React, { SVGProps, useState } from "react";

export interface Props {
  items: ItemModel[];
  totalSize: number;
}

export const ItemTable = ({ items, totalSize }: Props) => {
  const collapsedSetRef = React.useRef<Set<bigint>>(new Set());
  const [updateTrigger, setUpdateTrigger] = useState(0);
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
    <Table className="max-w-[1100px]">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">
            <Button onClick={() => setSortBy("shallowSize")}>
              Shallow Size{" "}
              <MaterialSymbolsKeyboardArrowDown
                style={{
                  color: sortBy === "shallowSize" ? "#777" : "transparent",
                }}
              />
            </Button>
          </TableHead>
          <TableHead className="w-[80px]">Shallow Ratio </TableHead>
          <TableHead className="w-[120px]">
            <Button onClick={() => setSortBy("retainSize")}>
              Retain Size
              <MaterialSymbolsKeyboardArrowDown
                style={{
                  color: sortBy === "retainSize" ? "#777" : "transparent",
                }}
              />
            </Button>
          </TableHead>
          <TableHead className="w-[80px]">Retain Ratio</TableHead>
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
    icon = <span className="mr-5" style={{ paddingLeft: depth * 24 }}></span>;
  } else if (foldState === "folded") {
    icon = (
      <span className="mr-1 text-gray-400" style={{ paddingLeft: depth * 24 }}>
        <MaterialSymbolsKeyboardArrowDown className="-rotate-90" />
      </span>
    );
  } else {
    icon = (
      <span className="mr-1 text-gray-400" style={{ paddingLeft: depth * 24 }}>
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

type SortBy = "shallowSize" | "retainSize";
function sort(items: ItemModel[], sortBy: SortBy): ItemModel[] {
  const t = items.concat();
  t.sort((a, b) => {
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
