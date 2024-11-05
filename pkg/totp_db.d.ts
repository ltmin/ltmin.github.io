/* tslint:disable */
/* eslint-disable */
/**
 * @returns {Promise<void>}
 */
export function bootstrap(): Promise<void>;
/**
 * @returns {Promise<Uint8Array>}
 */
export function export_backup(): Promise<Uint8Array>;
/**
 * @param {string} password
 * @param {Uint8Array} backup_data
 * @returns {Promise<boolean>}
 */
export function restore_backup(password: string, backup_data: Uint8Array): Promise<boolean>;
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
 * @param {string} old_password
 * @param {string} new_password
 * @returns {Promise<boolean>}
 */
export function edit_password(old_password: string, new_password: string): Promise<boolean>;
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
  readonly export_backup: () => number;
  readonly restore_backup: (a: number, b: number, c: number) => number;
  readonly register: (a: number, b: number) => number;
  readonly login: (a: number, b: number) => number;
  readonly logout: () => number;
  readonly edit_password: (a: number, b: number, c: number, d: number) => number;
  readonly is_registered: () => number;
  readonly is_logged_in: () => number;
  readonly add_secret: (a: number, b: number, c: number, d: number) => number;
  readonly edit_secret: (a: number, b: number, c: number, d: number) => number;
  readonly remove_secret: (a: number, b: number) => number;
  readonly list_codes: () => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_export_3: WebAssembly.Table;
  readonly closure74_externref_shim_multivalue_shim: (a: number, b: number, c: number) => Array;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly closure98_externref_shim: (a: number, b: number, c: number) => void;
  readonly closure128_externref_shim: (a: number, b: number, c: number) => void;
  readonly _dyn_core__ops__function__Fn_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hef74d31657d95520: (a: number, b: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly closure211_externref_shim: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_start: () => void;
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
