/* tslint:disable */
/* eslint-disable */
/**
 * @returns {Promise<void>}
 */
export function bootstrap(): Promise<void>;
/**
 * @param {string} password
 * @returns {Promise<boolean>}
 */
export function register(password: string): Promise<boolean>;
/**
 * @param {string} password
 * @returns {Promise<boolean>}
 */
export function login(password: string): Promise<boolean>;
/**
 * @returns {Promise<boolean>}
 */
export function logout(): Promise<boolean>;
/**
 * @returns {Promise<boolean>}
 */
export function is_registered(): Promise<boolean>;
/**
 * @returns {Promise<boolean>}
 */
export function is_logged_in(): Promise<boolean>;
/**
 * @param {string} label
 * @param {string} secret
 * @returns {Promise<string>}
 */
export function add_secret(label: string, secret: string): Promise<string>;
/**
 * @param {string} id
 * @param {string} label
 * @returns {Promise<boolean>}
 */
export function edit_secret(id: string, label: string): Promise<boolean>;
/**
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export function remove_secret(id: string): Promise<boolean>;
/**
 * @returns {Promise<any>}
 */
export function list_codes(): Promise<any>;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly bootstrap: () => number;
  readonly register: (a: number, b: number) => number;
  readonly login: (a: number, b: number) => number;
  readonly logout: () => number;
  readonly is_registered: () => number;
  readonly is_logged_in: () => number;
  readonly add_secret: (a: number, b: number, c: number, d: number) => number;
  readonly edit_secret: (a: number, b: number, c: number, d: number) => number;
  readonly remove_secret: (a: number, b: number) => number;
  readonly list_codes: () => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h4c64a882a50e3ae8: (a: number, b: number, c: number, d: number) => void;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hf4fb16ea2d39d34d: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__Fn__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h21985599579c0101: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__Fn_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h26be19e15cb03de3: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__h925b59b2d478d551: (a: number, b: number, c: number, d: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
