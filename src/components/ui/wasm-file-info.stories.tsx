import { WasmFileInfo } from "./wasm-file-info";

export default {
  title: "Components/WasmFileInfo",
  component: WasmFileInfo,
  argTypes: {},
};

export const DefaultWamFileInfo = () => (
  <WasmFileInfo
    wasm={{
      name: "test_bg_wasm.wasm",
      binary: new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]),
      importedTime: Date.now(),
      lastModified: Date.now() - 1000 * 60 * 60 * 24 * 7,
    }}
  />
);
