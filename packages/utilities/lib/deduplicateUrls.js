"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deduplicateUrls = void 0;
/**
 * Removes duplicate URLs from an array of URLs.
 *
 * @returns An array of unique URLs.
 */
const deduplicateUrls = (unfilteredUrls) => {
    return [...new Set(unfilteredUrls.map((url) => url.toString()))].map((url) => new URL(url));
};
exports.deduplicateUrls = deduplicateUrls;
//# sourceMappingURL=deduplicateUrls.js.map