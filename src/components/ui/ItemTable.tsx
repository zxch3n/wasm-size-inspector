import { ItemModel } from "@/types";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./table";
import { Button } from "./button";

import { SVGProps, useState } from "react";

export interface Props {
  items: ItemModel[];
  totalSize: number;
}

export const ItemTable = ({ items, totalSize }: Props) => {
  const [sortBy, setSortBy] = useState<SortBy>("retainSize");
  const sortedItems = sort(items, sortBy);
  const rows = sortedItems.flatMap((item) => {
    const rows = [<Row key={item.id} item={item} totalSize={totalSize} />];
    if (!item.collapse) {
      const children = sort(item.children, sortBy);
      for (const c of children) {
        rows.push(<Row key={c.id} item={c} totalSize={totalSize} />);
      }
    }
    return rows;
  });
  console.log(rows.length);
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="">
            <Button onClick={() => setSortBy("shallowSize")}>
              Shallow Size{" "}
              <MaterialSymbolsKeyboardArrowDown
                style={{
                  color: sortBy === "shallowSize" ? "#777" : "transparent",
                }}
              />
            </Button>
          </TableHead>
          <TableHead>Shallow Ratio </TableHead>
          <TableHead>
            <Button onClick={() => setSortBy("retainSize")}>
              Retain Size
              <MaterialSymbolsKeyboardArrowDown
                style={{
                  color: sortBy === "retainSize" ? "#777" : "transparent",
                }}
              />
            </Button>
          </TableHead>
          <TableHead>Retain Ratio</TableHead>
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{rows}</TableBody>
    </Table>
  );
};

function Row({ item, totalSize }: { item: ItemModel; totalSize: number }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{item.shallowSize}</TableCell>
      <TableCell>
        {((item.shallowSize / totalSize) * 100).toFixed(2)}%
      </TableCell>
      <TableCell>{item.retainSize}</TableCell>
      <TableCell>{((item.retainSize / totalSize) * 100).toFixed(2)}%</TableCell>
      <TableCell className="text-right">{item.name}</TableCell>
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
      className="inline-block"
      {...props}
    >
      <path
        fill="currentColor"
        d="m12 15.4l-6-6L7.4 8l4.6 4.6L16.6 8L18 9.4z"
      ></path>
    </svg>
  );
}
