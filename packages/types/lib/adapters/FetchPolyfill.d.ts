/// <reference types="node" />
/// <reference types="node" />
declare let fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
export type FetchPolyfill = typeof fetch;
declare type HeadersInit = Headers | string[][] | {
    [key: string]: string;
};
declare class Headers {
    constructor(init?: HeadersInit);
    append(name: string, value: string): void;
    delete(name: string): void;
    get(name: string): string | null;
    has(name: string): boolean;
    set(name: string, value: string): void;
    entries(): IterableIterator<[string, string]>;
    forEach(callback: (value: string, index: number, headers: Headers) => void, thisArg?: unknown): void;
    keys(): IterableIterator<string>;
    values(): IterableIterator<string>;
    [Symbol.iterator](): IterableIterator<[string, string]>;
}
declare type BodyInit = Blob | ArrayBufferView | ArrayBuffer | string;
declare type ResponseBodyInit = BodyInit;
interface Body {
    readonly bodyUsed: boolean;
    arrayBuffer(): Promise<ArrayBuffer>;
    blob(): Promise<Blob>;
    json(): Promise<JSON>;
    json<T>(): Promise<T>;
    text(): Promise<string>;
}
declare type RequestInfo = Request | string;
declare class Request implements Body {
    constructor(input: RequestInfo, init?: RequestInit);
    readonly method: string;
    readonly url: string;
    readonly headers: Headers;
    readonly type: RequestType;
    readonly destination: RequestDestination;
    readonly referrer: string;
    readonly referrerPolicy: ReferrerPolicy;
    readonly mode: RequestMode;
    readonly credentials: RequestCredentials;
    readonly cache: RequestCache;
    readonly redirect: RequestRedirect;
    readonly integrity: string;
    readonly keepalive: boolean;
    readonly bodyUsed: boolean;
    arrayBuffer(): Promise<ArrayBuffer>;
    blob(): Promise<Blob>;
    json(): Promise<JSON>;
    json<T>(): Promise<T>;
    text(): Promise<string>;
    clone(): Request;
}
interface RequestInit {
    signal?: AbortSignal;
    method?: string;
    headers?: HeadersInit;
    body?: BodyInit;
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
    mode?: RequestMode;
    credentials?: RequestCredentials;
    cache?: RequestCache;
    redirect?: RequestRedirect;
    integrity?: string;
    window?: null;
}
type RequestType = '' | 'audio' | 'font' | 'image' | 'script' | 'style' | 'track' | 'video';
type RequestDestination = '' | 'document' | 'embed' | 'font' | 'image' | 'manifest' | 'media' | 'object' | 'report' | 'script' | 'serviceworker' | 'sharedworker' | 'style' | 'worker' | 'xslt';
type RequestMode = 'navigate' | 'same-origin' | 'no-cors' | 'cors';
type RequestCredentials = 'omit' | 'same-origin' | 'include';
type RequestCache = 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached';
type RequestRedirect = 'follow' | 'error' | 'manual';
type ReferrerPolicy = '' | 'no-referrer' | 'no-referrer-when-downgrade' | 'same-origin' | 'origin' | 'strict-origin' | 'origin-when-cross-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
declare class Response implements Body {
    constructor(body?: ResponseBodyInit, init?: ResponseInit);
    static error(): Response;
    static redirect(url: string, status?: number): Response;
    readonly type: ResponseType;
    readonly url: string;
    readonly redirected: boolean;
    readonly status: number;
    readonly ok: boolean;
    readonly statusText: string;
    readonly headers: Headers;
    readonly body: Body | null;
    readonly trailer: Promise<Headers>;
    readonly bodyUsed: boolean;
    arrayBuffer(): Promise<ArrayBuffer>;
    blob(): Promise<Blob>;
    json(): Promise<Record<string, unknown>>;
    json<T>(): Promise<T>;
    text(): Promise<string>;
    clone(): Response;
}
interface ResponseInit {
    status?: number;
    statusText?: string;
    headers?: HeadersInit;
}
type ResponseType = 'basic' | 'cors' | 'default' | 'error' | 'opaque' | 'opaqueredirect';
export {};
