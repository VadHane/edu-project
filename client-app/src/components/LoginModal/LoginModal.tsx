import {
    Alert,
    Button,
    Modal,
    TextField,
    Typography,
    CircularProgress,
    Snackbar,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    INCORRECT_EMAIL_EXCEPTION,
    LENGTH_OF_PASSWORD_EXCEPTION,
} from '../../exceptions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useAuthActions } from './../../hooks/useAuthActions';
import './LoginModal.css';

const LoginModal: FunctionComponent = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const { authorization } = useAuthActions();
    const { isAuth, error, isLoading } = useTypedSelector((state) => state.auth);

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
    }, [error]);

    const validation = (): boolean => {
        const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!email.match(pattern)) {
            setEmailError(INCORRECT_EMAIL_EXCEPTION);
            return false;
        }

        if (password.trim().length < 3) {
            setPasswordError(LENGTH_OF_PASSWORD_EXCEPTION);
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

        authorization(email, password);
    };

    const loginModalNode: React.ReactNode = (
        <>
            <Modal
                open={true}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="modal-window">
                    {isLoading ? (
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
                                Login
                            </Typography>

                            <TextField
                                id="standard-basic"
                                className="text_field"
                                label="Email"
                                variant="standard"
                                onChange={(e) => setEmail(e.target?.value)}
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
                                onChange={(e) => setPassword(e.target?.value)}
                                value={password}
                                error={passwordError !== ''}
                                helperText={passwordError}
                            />

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
                    {error}
                </Alert>
            </Snackbar>
        </>
    );

    return (
        <div>
            {loginModalNode}
            {statusNode}
        </div>
    );
};

export default LoginModal;
