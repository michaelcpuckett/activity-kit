export * as AP from './activitypub';
export * from './assertions';
export declare type Plugin = {
    handleCreateUserActor?: Function;
    handleOutboxSideEffect?: Function;
    handleInboxSideEffect?: Function;
    generateActorId?: Function;
    getHomePageProps?: Function;
    getEntityPageProps?: Function;
    getIsEntityGetRequest?: Function;
};
export declare type AuthAdapter = {
    createUser: Function;
    getUserIdByToken: Function;
    authenticatePassword: Function;
};
export declare type DbAdapter = {
    expandCollection: Function;
    expandEntity: Function;
    getPrivateKey: Function;
    fetchEntityById: Function;
    findAll: Function;
    findEntityById: Function;
    findOne: Function;
    findStringIdByValue: Function;
    findStringValueById: Function;
    getActorByUserId: Function;
    getStreamByName: Function;
    insertItem: Function;
    removeItem: Function;
    insertOrderedItem: Function;
    removeOrderedItem: Function;
    queryById: Function;
    saveEntity: Function;
    saveString: Function;
};
export declare const DbOptions: {
    readonly CASE_INSENSITIVE: "CASE_INSENSITIVE";
};
export interface StorageAdapter {
    upload: Function;
}
