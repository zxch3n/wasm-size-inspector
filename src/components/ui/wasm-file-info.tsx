import { WasmFile } from "@/types";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function WasmFileInfo({
  wasm: { binary, importedTime, lastModified, name },
  className,
}: {
  wasm: WasmFile;
  className?: string;
}) {
  return (
    <div className={className}>
      <HoverCard>
        <HoverCardTrigger>
          Imported:{" "}
          <span className="inline-block cursor-default rounded px-2 py-1 text-white underline hover:bg-sky-500/10">
            {name}
          </span>
        </HoverCardTrigger>
        <HoverCardContent className="border">
          <ul>
            <li>Size: {binary.byteLength} bytes</li>
            <li>Imported: {convertDate(importedTime)}</li>
            <li>Last modified: {convertDate(lastModified)}</li>
          </ul>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}

function convertDate(_date: number): string {
  const date = new Date(_date);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
