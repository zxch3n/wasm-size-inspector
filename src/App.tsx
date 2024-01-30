import { useState } from "react";
import logo from "/icon.svg";
import { Dropzone } from "@/components/ui/dropzone";
import { Button } from "@/components/ui/button";
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
  const [waitForImporting, setWaitForImporting] = useState(true);
  return (
    <div className="dark min-h-[100vh] bg-gray-900 text-gray-200">
      <div
        className="text-md flex h-12 justify-start bg-sky-950 pl-4"
        style={{ fontFamily: "monospace", fontWeight: 800 }}
      >
        <div className="flex items-center gap-2">
          <img src={logo} className="logo" alt="Vite logo" width={24} />
          <p>WASM Size Inspector</p>
        </div>
      </div>

      <div className="m-4">
        {!!importedWasm && (
          <Button
            size={"sm"}
            className="mb-2 p-2"
            onClick={() => setWaitForImporting((v) => !v)}
          >
            {waitForImporting ? "Hide Import" : "Import"}
          </Button>
        )}
        {waitForImporting || !importedWasm ? (
          <Dropzone
            onRead={(x) => {
              setImportedWasm(x);
              setWaitForImporting(false);
            }}
          />
        ) : undefined}

        {importedWasm ? <WasmFileInfo wasm={importedWasm} /> : null}
        <div className="mt-2">
          {importedWasm ? <WasmTable wasm={importedWasm.binary} /> : null}
        </div>
      </div>
    </div>
  );
}

export default App;
