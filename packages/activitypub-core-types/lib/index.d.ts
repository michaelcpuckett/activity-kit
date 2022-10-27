/// <reference types="node" />
export * as AP from './activitypub';
export declare type Plugin = {
    handleCreateUserActor?: Function;
    handleOutboxActivity?: Function;
};
export declare type Auth = {
    createUser: Function;
    getUserIdByToken: (...args: unknown[]) => Promise<string | null>;
};
export declare type Database = {
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
export interface DatabaseService {
    connect(config?: {
        [key: string]: unknown;
    }): Promise<Database>;
}
export interface Storage {
    upload: (...args: unknown[]) => Promise<URL>;
}
