"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPeerInboxUrls = void 0;
async function getPeerInboxUrls() {
    const peers = this.adapters.db.findAll('peer', {});
    if (!peers) {
        return [];
    }
    return peers.map((peer) => {
        const [[domain, sharedInboxUrl]] = Object.entries(peer);
        return new URL(sharedInboxUrl);
    });
}
exports.getPeerInboxUrls = getPeerInboxUrls;
//# sourceMappingURL=getPeerInboxUrls.js.map