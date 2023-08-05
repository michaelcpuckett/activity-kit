/// <reference types="node" />
/**
 * Removes duplicate URLs from an array of URLs.
 *
 * @returns An array of unique URLs.
 */
export declare const deduplicateUrls: (unfilteredUrls: URL[]) => import("url").URL[];
