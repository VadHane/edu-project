export type Nullable<T> = T | null;

export type Maybe<T> = T | undefined;

export type IRoute = {
    path: string;
    element: JSX.Element;
    exact?: boolean;
};

export enum RouteNamesEnum {
    Users = '/users',
    AddUser = '/users/add',
    EditUserById = '/users/edit/:id',
}
