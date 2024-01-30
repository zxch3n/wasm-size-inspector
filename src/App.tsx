import { SVGProps, useState } from "react";
import logo from "/icon.svg";
import { Dropzone } from "@/components/ui/dropzone";
import { WasmFileInfo } from "@/components/ui/wasm-file-info";
import { WasmTable } from "./components/ui/item-table";
import { WasmFile } from "./types";
import { base64ToUint8Array } from "./lib/utils";
import helloWasm from "./assets/hello.wasm?raw-binary";

const DefaultBinary = base64ToUint8Array(helloWasm);
function App() {
  const [importedWasm, setImportedWasm] = useState<WasmFile>({
    name: "Example Hello World.wasm",
    binary: DefaultBinary,
    importedTime: Date.now(),
    lastModified: Date.now(),
  });
  return (
    <div className="dark min-h-[100vh] bg-gray-900 text-gray-200">
      <div
        className="text-md flex h-12 flex-row justify-between bg-sky-950 pl-4"
        style={{ fontFamily: "monospace", fontWeight: 800 }}
      >
        <div className="flex items-center gap-2">
          <img src={logo} className="logo" alt="Vite logo" width={24} />
          <p>WASM Size Inspector</p>
        </div>
        <div
          className="justify-content mr-4 flex cursor-pointer items-center"
          style={{ fontSize: 24 }}
        >
          <a
            href="https://github.com/zxch3n/wasm-size-inspector"
            target="_blank"
          >
            <MdiGithub />
          </a>
        </div>
      </div>

      <div className="m-4">
        <Dropzone
          onRead={(x) => {
            setImportedWasm(x);
          }}
        />
        {importedWasm ? (
          <WasmFileInfo wasm={importedWasm} className="mt-3" />
        ) : null}
        <div className="mt-2">
          {importedWasm ? <WasmTable wasm={importedWasm.binary} /> : null}
        </div>
      </div>
    </div>
  );
}

export default App;

export function MdiGithub(props: SVGProps<SVGSVGElement>) {
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
        d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
      ></path>
    </svg>
  );
}
