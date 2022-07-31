import { Button, Typography, Avatar, Box, AppBar, Toolbar } from '@mui/material';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTypedSelector } from './../../hooks/useTypedSelector';
import { useAuthActions } from './../../hooks/useAuthActions';
import { RouteNamesEnum } from './../../types/Route.types';
import { USER_DEFAULT_PICTURE } from '../../App.constants';

const Header: FunctionComponent = () => {
    const { isAuth, user } = useTypedSelector((state) => state.auth);
    const { logout } = useAuthActions();

    const navigate = useNavigate();

    const [userIsAuth, setUserIsAuth] = useState<boolean>(isAuth);
    const [userPictureUrl, setUserPictureUrl] = useState<string>('');

    useEffect(() => {
        setUserIsAuth(isAuth);
    }, [isAuth]);

    useEffect(() => {
        const photoUrl = `${process.env.REACT_APP_HOST_URL}/${user?.imageBlobKey}`;

        setUserPictureUrl(photoUrl);
    }, [user?.imageBlobKey]);

    const onClickLoginHandler = () => {
        navigate(RouteNamesEnum.Login);
    };

    const onFailedLoadPicture = () => {
        setUserPictureUrl(USER_DEFAULT_PICTURE.URL);
    };

    const onClickLogoutHandler = () => {
        logout();
        navigate('/');
    };

    const userNavBarButtonsNode: React.ReactNode = (
        <>
            <Button color="inherit" onClick={() => navigate(RouteNamesEnum.Models)}>
                Models
            </Button>
        </>
    );

    const adminNavBarButtonNode: React.ReactNode = (
        <>
            <Button color="inherit" onClick={() => navigate(RouteNamesEnum.Users)}>
                Users
            </Button>
            {userNavBarButtonsNode}
        </>
    );

    const authNavBarButtonsNode: React.ReactNode = (
        <>
            {user?.isAdmin ? adminNavBarButtonNode : userNavBarButtonsNode}
            <Button color="error" onClick={onClickLogoutHandler}>
                Logout
            </Button>
        </>
    );

    const navBarButtonsNode: React.ReactNode = (
        <>
            {userIsAuth ? (
                authNavBarButtonsNode
            ) : (
                <Button color="inherit" onClick={onClickLoginHandler}>
                    Login
                </Button>
            )}
        </>
    );

    const userPictureNode: React.ReactNode = (
        <>
            {isAuth ? (
                <>
                    <Typography variant="h6" component="div" className="user-name">
                        {user?.firstName}
                    </Typography>
                    <Avatar
                        alt="User picture"
                        src={userPictureUrl}
                        onError={onFailedLoadPicture}
                    />
                </>
            ) : (
                ''
            )}
        </>
    );

    const navBarNode: React.ReactNode = (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <NavLink className={'nav-link'} to={'/'}>
                            AmcBridge
                        </NavLink>
                    </Typography>
                    {navBarButtonsNode}
                    {userPictureNode}
                </Toolbar>
            </AppBar>
        </Box>
    );

    return (
        <>
            {navBarNode}
            <Outlet />
        </>
    );
};

export default Header;
