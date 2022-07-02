import { User } from '../../models/User';

type UserCreateAndUpdateModalProps = {
    buttonContent: string;
    resultActionType: ResultActions;
    user?: User;
};

export enum ResultActions {
    Add = 1,
    Edit = 2,
}

export default UserCreateAndUpdateModalProps;
