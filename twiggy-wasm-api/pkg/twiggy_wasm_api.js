import * as wasm from "./twiggy_wasm_api_bg.wasm";
import { __wbg_set_wasm } from "./twiggy_wasm_api_bg.js";
__wbg_set_wasm(wasm);
export * from "./twiggy_wasm_api_bg.js";
