import {
    Alert,
    Button,
    Modal,
    TextField,
    Typography,
    CircularProgress,
    Snackbar,
    Select,
    SelectChangeEvent,
    OutlinedInput,
    Chip,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FILE_NOT_IMAGE_EXCEPTION,
    INCORRECT_EMAIL_EXCEPTION,
    LENGTH_OF_NAME_EXCEPTION,
    LENGTH_OF_PASSWORD_EXCEPTION,
    LENGTH_OF_SURNAME_EXCEPTION,
    UNKNOWN_EXCEPTION,
} from '../../exceptions';
import { useRoleActions } from '../../hooks/useRoleActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Role } from '../../models/Role';
import { User } from '../../models/User';
import { useAuthActions } from './../../hooks/useAuthActions';
import './RegistrationModal.css';

const RegistrationModal: FunctionComponent = () => {
    const navigate = useNavigate();

    const { registration } = useAuthActions();
    const { getAllRoles } = useRoleActions();

    const { isAuth, error, isLoading } = useTypedSelector((state) => state.auth);
    const { roles } = useTypedSelector((state) => state.role);

    const [roleError, setRoleError] = useState<string>();
    const [roleIsLoading, setRoleIsLoading] = useState<boolean>(false);

    const [availableRoles, setAvailableRoles] = useState<Array<Role>>([]);
    const [assignedRoles, setAssignedRoles] = useState<Array<string>>([]);

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [firstNameError, setFirstNameError] = useState<string>('');
    const [lastNameError, setLastNameError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const file = React.createRef<HTMLInputElement>();

    useEffect(() => {
        setRoleIsLoading(true);

        getAllRoles((isDone, error) => {
            setRoleIsLoading(false);

            if (!isDone) {
                setRoleError(error || UNKNOWN_EXCEPTION);
            }
        });
    }, []);

    useEffect(() => {
        const availableRolesList = roles.filter((role) => !role.isAdmin);

        setAvailableRoles(availableRolesList);
    }, [roles]);

    useEffect(() => {
        if (isAuth) {
            navigate('/');
        }
    }, [isAuth]);

    useEffect(() => {
        setErrorMessage('');
        setEmailError('');
        setPasswordError('');
    }, [email, password]);

    useEffect(() => {
        if (error !== null) {
            setErrorMessage(error);
        }

        if (roleError) {
            setErrorMessage(roleError);
        }
    }, [error, roleError]);

    const validation = (): boolean => {
        if (firstName.trim().length < 3) {
            setFirstNameError(LENGTH_OF_NAME_EXCEPTION);
            return false;
        }

        if (lastName.trim().length < 3) {
            setLastNameError(LENGTH_OF_SURNAME_EXCEPTION);
            return false;
        }

        const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!email.match(pattern)) {
            setEmailError(INCORRECT_EMAIL_EXCEPTION);
            return false;
        }

        if (password.trim().length < 3) {
            setPasswordError(LENGTH_OF_PASSWORD_EXCEPTION);
            return false;
        }

        if (file.current?.files?.item(0)?.type.split('/')[0] !== 'image') {
            setErrorMessage(FILE_NOT_IMAGE_EXCEPTION);
            return false;
        }

        return true;
    };

    const onClose = () => {
        navigate('/');
    };

    const onSendForm = () => {
        if (!validation()) {
            return;
        }

        const roles: Array<Role> = assignedRoles.map((roleName) => {
            const index = availableRoles.findIndex((role) => role.name === roleName);
            return availableRoles[index];
        });

        const photo = file.current?.files?.item(0);

        if (!photo || !roles) {
            return;
        }

        const user: User = {
            id: '',
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            imageBlobKey: null,
            roles: roles,
            isAdmin: false,
        };

        registration(user, photo);
    };

    const onAssignRole = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value;

        setAssignedRoles(typeof value === 'string' ? value.split(',') : value);
    };

    const rolesFieldNode = (
        <FormControl>
            <InputLabel id="multiple-chip-label">Roles</InputLabel>
            <Select
                labelId="multiple-chip-label"
                multiple
                value={assignedRoles.map((roleName) => roleName)}
                onChange={onAssignRole}
                input={<OutlinedInput id="select-multiple-chip" label="Roles" />}
                renderValue={(selected: Array<string>) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip variant="outlined" key={value} label={value} />
                        ))}
                    </Box>
                )}
            >
                {availableRoles.map((role) => (
                    <MenuItem key={role.id} value={role.name}>
                        {role.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );

    const loginModalNode: React.ReactNode = (
        <>
            <Modal
                open={true}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="modal-reg-window">
                    {isLoading || roleIsLoading ? (
                        <Box className="loading-circle">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <Typography
                                id="modal-modal-title"
                                variant="h4"
                                component="h2"
                            >
                                Registration
                            </Typography>

                            <TextField
                                id="standard-basic"
                                className="text_field"
                                label="First name"
                                variant="standard"
                                onChange={(e) => setFirstName(e.currentTarget.value)}
                                value={firstName}
                                error={firstNameError !== ''}
                                helperText={firstNameError}
                            />
                            <TextField
                                id="standard-basic"
                                className="text_field"
                                label="Last name"
                                variant="standard"
                                onChange={(e) => setLastName(e.currentTarget.value)}
                                value={lastName}
                                error={lastNameError !== ''}
                                helperText={lastNameError}
                            />
                            <TextField
                                id="standard-basic"
                                className="text_field"
                                label="Email"
                                variant="standard"
                                onChange={(e) => setEmail(e.currentTarget.value)}
                                value={email}
                                error={emailError !== ''}
                                helperText={emailError}
                            />
                            <TextField
                                className="text_field"
                                variant="standard"
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                value={password}
                                error={passwordError !== ''}
                                helperText={passwordError}
                            />

                            {rolesFieldNode}

                            <Button variant="contained" component="label">
                                Upload your photo
                                <input hidden accept="image/*" type="file" ref={file} />
                            </Button>

                            <Button
                                className="window_button"
                                variant="contained"
                                onClick={onSendForm}
                            >
                                Send
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>
        </>
    );

    const statusNode: React.ReactNode = (
        <>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={errorMessage !== ''}
                key={'top' + 'center'}
            >
                <Alert severity="error" sx={{ width: '100%' }}>
                    {error ?? roleError ?? errorMessage}
                </Alert>
            </Snackbar>
        </>
    );

    return (
        <>
            {loginModalNode}
            {statusNode}
        </>
    );
};

export default RegistrationModal;
