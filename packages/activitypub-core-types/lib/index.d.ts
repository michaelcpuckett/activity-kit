export * as AP from './activitypub';
export declare type Plugin = {
    handleCreateUserActor?: Function;
    handleOutboxActivity?: Function;
    generateActorId?: Function;
    getHomePageProps?: Function;
    getEntityPageProps?: Function;
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
