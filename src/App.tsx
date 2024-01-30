import { useState } from "react";
import logo from "/icon.svg";
import { Dropzone, WasmFile } from "@/components/ui/dropzone";
import { WasmTable } from "./components/ui/ItemTable";

function App() {
  const [importedWasm, setImportedWasm] = useState<WasmFile | undefined>(
    undefined,
  );
  return (
    <div className="dark min-h-[100vh] bg-gray-900 text-gray-200">
      <div
        className="text-md flex h-14 justify-start bg-sky-950 pl-4"
        style={{ fontFamily: "monospace", fontWeight: 800 }}
      >
        <div className="flex items-center gap-2">
          <img src={logo} className="logo" alt="Vite logo" width={24} />
          <p>WASM Size Inspector</p>
        </div>
      </div>

      <Dropzone onRead={setImportedWasm} />
      {importedWasm ? <WasmTable wasm={importedWasm.binary} /> : null}
    </div>
  );
}

export default App;
