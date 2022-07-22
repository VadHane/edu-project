export type Nullable<T> = T | null;

export type Maybe<T> = T | undefined;

export enum ModalResultActions {
    Add = 1,
    Edit = 2,
}

export enum SessionStorageFields {
    ACCESS_TOKEN = 'ACCESS_TOKEN',
    REFRESH_TOKEN = 'REFRESH_TOKEN',
}
