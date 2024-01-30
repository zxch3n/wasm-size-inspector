/* tslint:disable */
/* eslint-disable */

export interface ItemWasm {
  id: bigint;
  name: string;
  children: bigint[];
  shallowSize: number;
  retainSize: number;
  kind: "code" | "data" | "debug" | "misc"
}


/**
* Diff the old and new versions of a binary to see what sizes changed.
*/
export class Diff {
  free(): void;
/**
* The maximum number of items to display.
* @returns {number}
*/
  max_items(): number;
/**
* Whether or not `items` should be treated as regular expressions.
* @returns {boolean}
*/
  using_regexps(): boolean;
/**
* Set the maximum number of items to display.
* @param {number} n
*/
  set_max_items(n: number): void;
/**
* Set whether or not `items` should be treated as regular expressions.
* @param {boolean} using_regexps
*/
  set_using_regexps(using_regexps: boolean): void;
}
/**
* Compute and display the dominator tree for a binary's call graph.
*/
export class Dominators {
  free(): void;
/**
* Construct a new, default `Dominators`.
* @returns {Dominators}
*/
  static new(): Dominators;
/**
* The maximum depth to print the dominators tree.
* @returns {number}
*/
  max_depth(): number;
/**
* The maximum number of rows, regardless of depth in the tree, to display.
* @returns {number}
*/
  max_rows(): number;
/**
* Whether or not `items` should be treated as regular expressions.
* @returns {boolean}
*/
  using_regexps(): boolean;
/**
* Set the maximum depth to print the dominators tree.
* @param {number} max_depth
*/
  set_max_depth(max_depth: number): void;
/**
* Set the maximum number of rows, regardless of depth in the tree, to display.
* @param {number} max_rows
*/
  set_max_rows(max_rows: number): void;
/**
* Set whether or not `items` should be treated as regular expressions.
* @param {boolean} using_regexps
*/
  set_using_regexps(using_regexps: boolean): void;
}
/**
* Find and display code and data that is not transitively referenced by any
* exports or public functions.
*/
export class Garbage {
  free(): void;
/**
* Construct a new, default `Garbage`
* @returns {Garbage}
*/
  static new(): Garbage;
/**
* The maximum number of items to display.
* @returns {number}
*/
  max_items(): number;
/**
* Set the maximum number of items to display.
* @param {number} max
*/
  set_max_items(max: number): void;
/**
* Should data segments be shown normally or summarized in a single line?
* @returns {boolean}
*/
  show_data_segments(): boolean;
}
/**
*/
export class Items {
  free(): void;
/**
* @param {Uint8Array} data
* @returns {Items}
*/
  static parse(data: Uint8Array): Items;
/**
* @param {Top} options
* @returns {string}
*/
  top(options: Top): string;
/**
* @returns {ItemWasm[]}
*/
  items(): ItemWasm[];
/**
* @param {Dominators} options
* @returns {string}
*/
  dominators(options: Dominators): string;
/**
* @param {Paths} options
* @returns {string}
*/
  paths(options: Paths): string;
/**
* @param {Monos} options
* @returns {string}
*/
  monos(options: Monos): string;
/**
* @param {Items} new_items
* @param {Diff} options
* @returns {string}
*/
  diff(new_items: Items, options: Diff): string;
}
/**
* List the generic function monomorphizations that are contributing to
* code bloat.
*/
export class Monos {
  free(): void;
/**
* Construct a new, default `Monos`.
* @returns {Monos}
*/
  static new(): Monos;
/**
* Hide individual monomorphizations and only show the generic functions.
* @returns {boolean}
*/
  only_generics(): boolean;
/**
* The maximum number of generics to list.
* @returns {number}
*/
  max_generics(): number;
/**
* The maximum number of individual monomorphizations to list for each
* generic function.
* @returns {number}
*/
  max_monos(): number;
/**
* Whether or not `functions` should be treated as regular expressions.
* @returns {boolean}
*/
  using_regexps(): boolean;
/**
* Set whether to hide individual monomorphizations and only show the
* generic functions.
* @param {boolean} do_it
*/
  set_only_generics(do_it: boolean): void;
/**
* Set the maximum number of generics to list.
* @param {number} max
*/
  set_max_generics(max: number): void;
/**
* Set the maximum number of individual monomorphizations to list for each
* generic function.
* @param {number} max
*/
  set_max_monos(max: number): void;
}
/**
* Find and display the call paths to a function in the given binary's call
* graph.
*/
export class Paths {
  free(): void;
/**
* Construct a new, default `Paths`.
* @returns {Paths}
*/
  static new(): Paths;
/**
* Add a function to find call paths for.
* @param {string} _function
*/
  add_function(_function: string): void;
/**
* The maximum depth to print the paths.
* @returns {number}
*/
  max_depth(): number;
/**
* The maximum number of paths, regardless of depth in the tree, to display.
* @returns {number}
*/
  max_paths(): number;
/**
* The direction in which the call paths are traversed.
* @returns {boolean}
*/
  descending(): boolean;
/**
* Whether or not `functions` should be treated as regular expressions.
* @returns {boolean}
*/
  using_regexps(): boolean;
/**
* Set the maximum depth to print the paths.
* @param {number} max_depth
*/
  set_max_depth(max_depth: number): void;
/**
* Set the maximum number of paths, regardless of depth in the tree, to display.
* @param {number} max_paths
*/
  set_max_paths(max_paths: number): void;
/**
* Set the call path traversal direction.
* @param {boolean} descending
*/
  set_descending(descending: boolean): void;
/**
* Set Whether or not `functions` should be treated as regular expressions.
* @param {boolean} using_regexps
*/
  set_using_regexps(using_regexps: boolean): void;
}
/**
* List the top code size offenders in a binary.
*/
export class Top {
  free(): void;
/**
* Construct a new, default `Top`.
* @returns {Top}
*/
  static new(): Top;
/**
* The maximum number of items to display.
* @returns {number}
*/
  max_items(): number;
/**
* Display retaining paths.
* @returns {boolean}
*/
  retaining_paths(): boolean;
/**
* Sort list by retained size, rather than shallow size.
* @returns {boolean}
*/
  retained(): boolean;
/**
* Set the maximum number of items to display.
* @param {number} n
*/
  set_max_items(n: number): void;
/**
* Set whether to display and compute retaining paths.
* @param {boolean} do_it
*/
  set_retaining_paths(do_it: boolean): void;
/**
* Set whether to sort list by retained size, rather than shallow size.
* @param {boolean} do_it
*/
  set_retained(do_it: boolean): void;
}
