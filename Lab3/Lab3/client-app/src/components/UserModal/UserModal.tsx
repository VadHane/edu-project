import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import {
    FILE_NOT_CAD_EXCEPTION,
    FILE_NOT_IMAGE_EXCEPTION,
    INCORRECT_EMAIL_EXCEPTION,
    LENGTH_OF_NAME_EXCEPTION,
    LENGTH_OF_PASSWORD_EXCEPTION,
    LENGTH_OF_SURNAME_EXCEPTION,
    UNKNOWN_EXCEPTION,
} from '../../exceptions';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    Modal,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import {
    preloaderStyles,
    inputFieldStyle,
    contentStyle,
    modalWindowStyles,
} from './UserModal.style';
import { ModelModalProps } from './UserModal.types';
import {
    CREATE_NEW_ROLE_MESSAGE,
    MIN_LENGHT_INPUTING,
    ROLE_NOT_FOUND_MESSAGE,
} from './UserModal.constants';
import { useRoleActions } from '../../hooks/useRoleActions';
import { User } from '../../models/User';

const ModelModal: FunctionComponent<ModelModalProps> = (props: ModelModalProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [roleIsLoading, setRoleIsLoading] = useState<boolean>(false);
    const [isNewRole, setIsNewRole] = useState<boolean>(false);
    const [error, setError] = useState<Nullable<string>>(null);
    const [open, setOpen] = useState<boolean>(false);

    const { roles } = useTypedSelector((state) => state.role);
    const { user: authUser } = useTypedSelector((state) => state.auth);
    const { getAllRoles, addNewRole } = useRoleActions();

    const [user, setUser] = useState<User>({} as User);
    const [inputRolesList, setInputRolesList] = useState<string[]>([]);
    const [inputRoleName, setInputRoleName] = useState<string>('');

    const file = React.createRef<HTMLInputElement>();

    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    useEffect(() => {
        if (!open) {
            return;
        }

        setIsNewRole(false);
        setRoleIsLoading(true);

        getAllRoles((isDone, error) => {
            setRoleIsLoading(false);

            if (!isDone) {
                setError(error || UNKNOWN_EXCEPTION);
            }
        });
    }, [open]);

    useEffect(() => {
        const emptyUserEntity: User = {
            id: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            imageBlobKey: null,
            roles: [],
            isAdmin: false,
        };

        const user = props.user || emptyUserEntity;

        user.password = '';

        setUser(user);

        if (user.roles) {
            setInputRolesList([...user.roles.map((role) => role.name)]);
        }
    }, [props.user]);

    useEffect(() => {
        setError(null);
    }, [open, user, file.current]);

    useEffect(() => {
        if (inputRoleName.trim().length < MIN_LENGHT_INPUTING) {
            setIsNewRole(false);
            return;
        }

        const role = roles.find((role) => role.name === inputRoleName);

        setIsNewRole(!role);
    }, [inputRoleName]);

    const onChangeNameHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
        setUser((currentValue) => ({
            ...currentValue,
            firstName: e.currentTarget.value,
        }));

    const onChangeSurnameHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
        setUser((currentValue) => ({
            ...currentValue,
            lastName: e.currentTarget.value,
        }));

    const onChangeEmailHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
        setUser((currentValue) => ({
            ...currentValue,
            email: e.currentTarget.value,
        }));

    const onChangePasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
        setUser((currentValue) => ({
            ...currentValue,
            password: e.currentTarget.value,
        }));

    const onChangeRoleNameHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
        setInputRoleName(e.currentTarget.value);

    const onAddNewRoleHandler = () => {
        setRoleIsLoading(true);

        addNewRole({ id: '', name: inputRoleName, isAdmin: false }, (isDone, error) => {
            setRoleIsLoading(false);

            if (!isDone) {
                setError(error || UNKNOWN_EXCEPTION);
            }
        });
    };

    const validateInputFields = (): boolean => {
        if (user.firstName.trim().length < MIN_LENGHT_INPUTING) {
            setError(LENGTH_OF_NAME_EXCEPTION);
            return false;
        }

        if (user.lastName.trim().length < MIN_LENGHT_INPUTING) {
            setError(LENGTH_OF_SURNAME_EXCEPTION);
            return false;
        }

        const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!user.email.match(pattern)) {
            setError(INCORRECT_EMAIL_EXCEPTION);
            return false;
        }

        if (user.password.trim().length < MIN_LENGHT_INPUTING) {
            setError(LENGTH_OF_PASSWORD_EXCEPTION);
            return false;
        }

        if (file.current?.files?.item(0)?.type.split('/')[0] !== 'image') {
            setError(FILE_NOT_IMAGE_EXCEPTION);
            return false;
        }

        return true;
    };

    const assignRolesToUser = () => {
        const rolesList = inputRolesList.map((tagName) => {
            const index = roles.findIndex((role) => role.name === tagName);

            return roles[index];
        });

        return rolesList;
    };

    const onSendFormHandler = () => {
        if (!validateInputFields()) {
            return;
        }

        setIsLoading(true);

        const fileValue = file.current?.files?.item(0);

        if (!fileValue) {
            setError(FILE_NOT_CAD_EXCEPTION);
            console.log(fileValue);
            return;
        }

        const createdUser = { ...user, roles: assignRolesToUser() };

        props.onSendFormHandler(createdUser, fileValue, (isDone, error) => {
            setIsLoading(false);

            if (!isDone) {
                setError(error || UNKNOWN_EXCEPTION);
            } else {
                props.onCloseModalHandler();
            }
        });
    };

    const preloaderNode: React.ReactNode = (
        <Box sx={preloaderStyles}>
            <CircularProgress />
        </Box>
    );

    const roleListMessage: React.ReactNode = (
        <>
            {isNewRole && (
                <Typography variant="h6" component="span" sx={{ fontSize: '10px' }}>
                    {authUser?.isAdmin ? CREATE_NEW_ROLE_MESSAGE : ROLE_NOT_FOUND_MESSAGE}
                    {authUser?.isAdmin && (
                        <>
                            <IconButton
                                color="success"
                                component="label"
                                onClick={onAddNewRoleHandler}
                            >
                                <DoneOutlineIcon />
                            </IconButton>
                        </>
                    )}
                </Typography>
            )}
        </>
    );

    const rolesList: React.ReactNode = (
        <>
            {roleListMessage}
            <Autocomplete
                multiple
                id="tags-filled"
                options={roles.map((role) => role.name)}
                freeSolo
                renderTags={(value: readonly string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                        <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            key={option}
                        />
                    ))
                }
                value={inputRolesList}
                onChange={(e, value) => setInputRolesList(value)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Roles"
                        placeholder="Enter"
                        value={inputRoleName}
                        onChange={onChangeRoleNameHandler}
                    />
                )}
                sx={inputFieldStyle}
            />
        </>
    );

    const windowContentNode: React.ReactNode = (
        <>
            <Stack sx={contentStyle} direction="column" alignItems="center" spacing={2}>
                <TextField
                    id="standard-basic"
                    label="User name"
                    variant="standard"
                    onChange={onChangeNameHandler}
                    value={user.firstName}
                    sx={inputFieldStyle}
                    margin="dense"
                />
                <TextField
                    id="standard-basic"
                    label="User surname"
                    variant="standard"
                    onChange={onChangeSurnameHandler}
                    value={user.lastName}
                    sx={inputFieldStyle}
                    margin="dense"
                />
                <TextField
                    id="standard-basic"
                    label="Email"
                    variant="standard"
                    onChange={onChangeEmailHandler}
                    value={user.email}
                    sx={inputFieldStyle}
                    margin="dense"
                />
                <TextField
                    id="standard-basic"
                    variant="standard"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    onChange={onChangePasswordHandler}
                    value={user.password}
                    sx={{ width: '100%' }}
                />

                {roleIsLoading ? preloaderNode : rolesList}

                <Button variant="contained" component="label" size="small">
                    Upload your photo
                    <input hidden accept="image/*" type="file" ref={file} />
                </Button>
            </Stack>
            <Stack
                display="flex"
                direction="row"
                justifyContent="flex-end"
                spacing={1}
                sx={{ width: '90%', m: 1 }}
            >
                <Button
                    variant="contained"
                    size="small"
                    onClick={props.onCloseModalHandler}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    color="success"
                    endIcon={<SendIcon />}
                    onClick={onSendFormHandler}
                >
                    {props.resultButtonsCaption}
                </Button>
            </Stack>
        </>
    );

    const modalWindowNode: React.ReactNode = (
        <Modal
            open={open}
            onClose={props.onCloseModalHandler}
            closeAfterTransition
            BackdropProps={{
                timeout: 1000,
            }}
        >
            <Box sx={modalWindowStyles}>
                {isLoading ? preloaderNode : windowContentNode}
            </Box>
        </Modal>
    );

    const statusNode: React.ReactNode = (
        <>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={error !== null}
                key={'top' + 'center'}
            >
                <Alert severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );

    return (
        <>
            {error && statusNode}
            {modalWindowNode}
        </>
    );
};

export default ModelModal;
