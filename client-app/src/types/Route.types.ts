export enum RouteNamesEnum {
    Users = '/users',
    AddUser = '/users/add',
    EditUserById = '/users/edit/:id',

    Models = '/models',
    AddModel = '/models/add',
    EditModelById = '/models/edit/:id',
    ModelViewer = '/models/model-viewer/:modelId',
    ModelViewerForNavigate = '/models/model-viewer/',

    ModelsBrowser = '/models',

    Login = '/login',
    Registration = '/registration',
    StartPage = '/',
    PageNotFound = '/not-found',
}
