export * as AP from './activitypub';
export declare type Plugin = {
    handleCreateUserActor?: Function;
    handleOutboxActivity?: Function;
};
export declare type AuthAdapter = {
    createUser: Function;
    getUserIdByToken: Function;
};
export declare type DbAdapter = {
    expandCollection: Function;
    expandEntity: Function;
    fetchEntityById: Function;
    findAll: Function;
    findEntityById: Function;
    findOne: Function;
    findStringIdByValue: Function;
    findStringValueById: Function;
    getActorByUserId: Function;
    getCollectionItems: Function;
    insertItem: Function;
    removeItem: Function;
    insertOrderedItem: Function;
    removeOrderedItem: Function;
    queryById: Function;
    saveEntity: Function;
    saveString: Function;
};
export interface StorageAdapter {
    upload: Function;
}
