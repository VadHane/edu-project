type UserCreateAndUpdateModalProps = {
    buttonContent: string;
    resultActionType: ResultActions;
};

export enum ResultActions {
    Add = 1,
    Edit = 2,
}

export default UserCreateAndUpdateModalProps;
