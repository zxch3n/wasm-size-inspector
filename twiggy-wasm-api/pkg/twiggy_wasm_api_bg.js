let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
* Diff the old and new versions of a binary to see what sizes changed.
*/
export class Diff {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_diff_free(ptr);
    }
    /**
    * The maximum number of items to display.
    * @returns {number}
    */
    max_items() {
        const ret = wasm.diff_max_items(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * Whether or not `items` should be treated as regular expressions.
    * @returns {boolean}
    */
    using_regexps() {
        const ret = wasm.diff_using_regexps(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * Set the maximum number of items to display.
    * @param {number} n
    */
    set_max_items(n) {
        wasm.diff_set_max_items(this.__wbg_ptr, n);
    }
    /**
    * Set whether or not `items` should be treated as regular expressions.
    * @param {boolean} using_regexps
    */
    set_using_regexps(using_regexps) {
        wasm.diff_set_using_regexps(this.__wbg_ptr, using_regexps);
    }
}
/**
* Compute and display the dominator tree for a binary's call graph.
*/
export class Dominators {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Dominators.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_dominators_free(ptr);
    }
    /**
    * Construct a new, default `Dominators`.
    * @returns {Dominators}
    */
    static new() {
        const ret = wasm.dominators_new();
        return Dominators.__wrap(ret);
    }
    /**
    * The maximum depth to print the dominators tree.
    * @returns {number}
    */
    max_depth() {
        const ret = wasm.dominators_max_depth(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * The maximum number of rows, regardless of depth in the tree, to display.
    * @returns {number}
    */
    max_rows() {
        const ret = wasm.dominators_max_rows(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * Whether or not `items` should be treated as regular expressions.
    * @returns {boolean}
    */
    using_regexps() {
        const ret = wasm.dominators_using_regexps(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * Set the maximum depth to print the dominators tree.
    * @param {number} max_depth
    */
    set_max_depth(max_depth) {
        wasm.dominators_set_max_depth(this.__wbg_ptr, max_depth);
    }
    /**
    * Set the maximum number of rows, regardless of depth in the tree, to display.
    * @param {number} max_rows
    */
    set_max_rows(max_rows) {
        wasm.dominators_set_max_rows(this.__wbg_ptr, max_rows);
    }
    /**
    * Set whether or not `items` should be treated as regular expressions.
    * @param {boolean} using_regexps
    */
    set_using_regexps(using_regexps) {
        wasm.dominators_set_using_regexps(this.__wbg_ptr, using_regexps);
    }
}
/**
* Find and display code and data that is not transitively referenced by any
* exports or public functions.
*/
export class Garbage {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Garbage.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_garbage_free(ptr);
    }
    /**
    * Construct a new, default `Garbage`
    * @returns {Garbage}
    */
    static new() {
        const ret = wasm.garbage_new();
        return Garbage.__wrap(ret);
    }
    /**
    * The maximum number of items to display.
    * @returns {number}
    */
    max_items() {
        const ret = wasm.garbage_max_items(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * Set the maximum number of items to display.
    * @param {number} max
    */
    set_max_items(max) {
        wasm.garbage_set_max_items(this.__wbg_ptr, max);
    }
    /**
    * Should data segments be shown normally or summarized in a single line?
    * @returns {boolean}
    */
    show_data_segments() {
        const ret = wasm.garbage_show_data_segments(this.__wbg_ptr);
        return ret !== 0;
    }
}
/**
*/
export class Items {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Items.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_items_free(ptr);
    }
    /**
    * @param {Uint8Array} data
    * @returns {Items}
    */
    static parse(data) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.items_parse(ptr0, len0);
        return Items.__wrap(ret);
    }
    /**
    * @param {Top} options
    * @returns {string}
    */
    top(options) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(options, Top);
            wasm.items_top(retptr, this.__wbg_ptr, options.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @returns {ItemWasm[]}
    */
    items() {
        const ret = wasm.items_items(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * @param {Dominators} options
    * @returns {string}
    */
    dominators(options) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(options, Dominators);
            wasm.items_dominators(retptr, this.__wbg_ptr, options.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @param {Paths} options
    * @returns {string}
    */
    paths(options) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(options, Paths);
            wasm.items_paths(retptr, this.__wbg_ptr, options.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @param {Monos} options
    * @returns {string}
    */
    monos(options) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(options, Monos);
            wasm.items_monos(retptr, this.__wbg_ptr, options.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @param {Items} new_items
    * @param {Diff} options
    * @returns {string}
    */
    diff(new_items, options) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(new_items, Items);
            _assertClass(options, Diff);
            wasm.items_diff(retptr, this.__wbg_ptr, new_items.__wbg_ptr, options.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
/**
* List the generic function monomorphizations that are contributing to
* code bloat.
*/
export class Monos {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Monos.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_monos_free(ptr);
    }
    /**
    * Construct a new, default `Monos`.
    * @returns {Monos}
    */
    static new() {
        const ret = wasm.monos_new();
        return Monos.__wrap(ret);
    }
    /**
    * Hide individual monomorphizations and only show the generic functions.
    * @returns {boolean}
    */
    only_generics() {
        const ret = wasm.monos_only_generics(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * The maximum number of generics to list.
    * @returns {number}
    */
    max_generics() {
        const ret = wasm.monos_max_generics(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * The maximum number of individual monomorphizations to list for each
    * generic function.
    * @returns {number}
    */
    max_monos() {
        const ret = wasm.monos_max_monos(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * Whether or not `functions` should be treated as regular expressions.
    * @returns {boolean}
    */
    using_regexps() {
        const ret = wasm.monos_using_regexps(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * Set whether to hide individual monomorphizations and only show the
    * generic functions.
    * @param {boolean} do_it
    */
    set_only_generics(do_it) {
        wasm.monos_set_only_generics(this.__wbg_ptr, do_it);
    }
    /**
    * Set the maximum number of generics to list.
    * @param {number} max
    */
    set_max_generics(max) {
        wasm.monos_set_max_generics(this.__wbg_ptr, max);
    }
    /**
    * Set the maximum number of individual monomorphizations to list for each
    * generic function.
    * @param {number} max
    */
    set_max_monos(max) {
        wasm.monos_set_max_monos(this.__wbg_ptr, max);
    }
}
/**
* Find and display the call paths to a function in the given binary's call
* graph.
*/
export class Paths {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Paths.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_paths_free(ptr);
    }
    /**
    * Construct a new, default `Paths`.
    * @returns {Paths}
    */
    static new() {
        const ret = wasm.paths_new();
        return Paths.__wrap(ret);
    }
    /**
    * Add a function to find call paths for.
    * @param {string} _function
    */
    add_function(_function) {
        const ptr0 = passStringToWasm0(_function, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.paths_add_function(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * The maximum depth to print the paths.
    * @returns {number}
    */
    max_depth() {
        const ret = wasm.paths_max_depth(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * The maximum number of paths, regardless of depth in the tree, to display.
    * @returns {number}
    */
    max_paths() {
        const ret = wasm.paths_max_paths(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * The direction in which the call paths are traversed.
    * @returns {boolean}
    */
    descending() {
        const ret = wasm.monos_only_generics(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * Whether or not `functions` should be treated as regular expressions.
    * @returns {boolean}
    */
    using_regexps() {
        const ret = wasm.paths_using_regexps(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * Set the maximum depth to print the paths.
    * @param {number} max_depth
    */
    set_max_depth(max_depth) {
        wasm.paths_set_max_depth(this.__wbg_ptr, max_depth);
    }
    /**
    * Set the maximum number of paths, regardless of depth in the tree, to display.
    * @param {number} max_paths
    */
    set_max_paths(max_paths) {
        wasm.paths_set_max_paths(this.__wbg_ptr, max_paths);
    }
    /**
    * Set the call path traversal direction.
    * @param {boolean} descending
    */
    set_descending(descending) {
        wasm.monos_set_only_generics(this.__wbg_ptr, descending);
    }
    /**
    * Set Whether or not `functions` should be treated as regular expressions.
    * @param {boolean} using_regexps
    */
    set_using_regexps(using_regexps) {
        wasm.paths_set_using_regexps(this.__wbg_ptr, using_regexps);
    }
}
/**
* List the top code size offenders in a binary.
*/
export class Top {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Top.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_top_free(ptr);
    }
    /**
    * Construct a new, default `Top`.
    * @returns {Top}
    */
    static new() {
        const ret = wasm.top_new();
        return Top.__wrap(ret);
    }
    /**
    * The maximum number of items to display.
    * @returns {number}
    */
    max_items() {
        const ret = wasm.paths_max_depth(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * Display retaining paths.
    * @returns {boolean}
    */
    retaining_paths() {
        const ret = wasm.top_retaining_paths(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * Sort list by retained size, rather than shallow size.
    * @returns {boolean}
    */
    retained() {
        const ret = wasm.garbage_show_data_segments(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * Set the maximum number of items to display.
    * @param {number} n
    */
    set_max_items(n) {
        wasm.paths_set_max_depth(this.__wbg_ptr, n);
    }
    /**
    * Set whether to display and compute retaining paths.
    * @param {boolean} do_it
    */
    set_retaining_paths(do_it) {
        wasm.top_set_retaining_paths(this.__wbg_ptr, do_it);
    }
    /**
    * Set whether to sort list by retained size, rather than shallow size.
    * @param {boolean} do_it
    */
    set_retained(do_it) {
        wasm.top_set_retained(this.__wbg_ptr, do_it);
    }
}

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbindgen_object_clone_ref(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

export function __wbindgen_error_new(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbindgen_number_new(arg0) {
    const ret = arg0;
    return addHeapObject(ret);
};

export function __wbindgen_bigint_from_u64(arg0) {
    const ret = BigInt.asUintN(64, arg0);
    return addHeapObject(ret);
};

export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbg_set_20cbc34131e76824(arg0, arg1, arg2) {
    getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
};

export function __wbg_new_34c624469fb1d4fd() {
    const ret = new Array();
    return addHeapObject(ret);
};

export function __wbg_new_87d841e70661f6e9() {
    const ret = new Object();
    return addHeapObject(ret);
};

export function __wbg_set_379b27f1d5f1bf9c(arg0, arg1, arg2) {
    getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

