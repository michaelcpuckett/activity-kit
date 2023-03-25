"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveEntity = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function saveEntity(entity) {
    if (!entity.id) {
        throw new Error('No ID.');
    }
    const collectionName = (0, activitypub_core_utilities_1.getCollectionNameByUrl)(entity.id);
    const _id = entity.id.toString();
    const convertedEntity = {
        to: null,
        height: null,
        href: null,
        hrefLang: null,
        mediaType: null,
        name: null,
        nameMap: null,
        preview: null,
        rel: null,
        width: null,
        attachment: null,
        attributedTo: null,
        audience: null,
        bcc: null,
        bto: null,
        cc: null,
        content: null,
        contentMap: null,
        context: null,
        duration: null,
        endTime: null,
        generator: null,
        icon: null,
        image: null,
        inReplyTo: null,
        location: null,
        published: null,
        replies: null,
        startTime: null,
        summary: null,
        summaryMap: null,
        tag: null,
        updated: null,
        url: null,
        likes: null,
        shares: null,
        source: null,
        sensitive: null,
        actor: null,
        object: null,
        target: null,
        result: null,
        origin: null,
        instrument: null,
        oneOf: null,
        anyOf: null,
        closed: null,
        inbox: null,
        outbox: null,
        following: null,
        followers: null,
        liked: null,
        preferredUsername: null,
        preferredUsernameMap: null,
        streams: null,
        endpoints: null,
        publicKey: null,
        manuallyApprovesFollowers: null,
        totalItems: null,
        items: null,
        current: null,
        first: null,
        last: null,
        orderedItems: null,
        startIndex: null,
        formerType: null,
        deleted: null,
        subject: null,
        relationship: null,
        accuracy: null,
        laltitude: null,
        longitude: null,
        radius: null,
        units: null,
        describes: null,
        ...(0, activitypub_core_utilities_1.cleanProps)((0, activitypub_core_utilities_1.convertUrlsToStrings)((0, activitypub_core_utilities_1.applyContext)(entity))),
        _id,
    };
    for (const key of Object.keys(convertedEntity)) {
        if (convertedEntity[key] && typeof convertedEntity[key] === 'object') {
            convertedEntity[key] = 'JSON:' + JSON.stringify(convertedEntity[key]);
        }
    }
    const existingRecord = await this.db.get(`SELECT * from ${collectionName} WHERE _id = ?;`, _id);
    if (existingRecord) {
        const updateQuery = `UPDATE ${collectionName} SET ${Object.keys(convertedEntity)
            .map((key) => `"${key}" = ?`)
            .join(', ')} WHERE _id = "${_id}";`;
        return await this.db.run(updateQuery, Object.values(convertedEntity));
    }
    else {
        const insertQuery = `INSERT INTO ${collectionName} ("${Object.keys(convertedEntity).join('", "')}") VALUES (${Object.keys(convertedEntity)
            .map(() => '?')
            .join(', ')});`;
        return await this.db.run(insertQuery, Object.values(convertedEntity));
    }
}
exports.saveEntity = saveEntity;
//# sourceMappingURL=saveEntity.js.map