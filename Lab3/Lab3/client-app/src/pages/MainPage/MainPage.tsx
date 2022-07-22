import React, { FunctionComponent, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { RouteNamesEnum } from '../../types/Route.types';
import { Box, AppBar, Toolbar, Typography, Button, Avatar } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { adminRoutes, publicRoutes, userRoutes } from '../../routers';
import { useAuthActions } from './../../hooks/useAuthActions';
import './MainPage.css';
import { USER_DEFAULT_PICTURE } from '../../App.constants';

const MainPage: FunctionComponent = () => {
    const { isAuth, user } = useTypedSelector((state) => state.auth);
    const { logout } = useAuthActions();

    const [userIsAuth, setUserIsAuth] = useState<boolean>(isAuth);
    const [userPictureUrl, setUserPictureUrl] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        setUserIsAuth(isAuth);
    }, [isAuth]);

    useEffect(() => {
        const photoUrl = `${process.env.REACT_APP_HOST_URL}/${user?.imageBlobKey}`;

        setUserPictureUrl(photoUrl);
    }, [user?.imageBlobKey]);

    const onFailedLoadPicture = () => {
        setUserPictureUrl(USER_DEFAULT_PICTURE.URL);
    };

    const onClickLoginHandler = () => {
        navigate(RouteNamesEnum.Login);
    };

    const onClickRegistrationHandler = () => {
        navigate(RouteNamesEnum.Registration);
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

    const mainPageNode: React.ReactNode = (
        <div className="text">
            <h1>Welcome!</h1>
            {userIsAuth || (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onClickLoginHandler}
                    >
                        Login
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={onClickRegistrationHandler}
                    >
                        Registration
                    </Button>
                </>
            )}
        </div>
    );

    const publicRoutesNode: React.ReactNode = (
        <>
            {publicRoutes.map((route) => (
                <Route {...route} key={route.path} />
            ))}
        </>
    );

    const userRoutesNode: React.ReactNode = (
        <>
            {userRoutes.map((route) => (
                <Route {...route} key={route.path} />
            ))}
        </>
    );

    const adminRoutesNode: React.ReactNode = (
        <>
            {adminRoutes.map((route) => (
                <Route {...route} key={route.path} />
            ))}
        </>
    );

    const authRoutesNode: React.ReactNode = (
        <>{user?.isAdmin ? adminRoutesNode : userRoutesNode}</>
    );

    const routesNode: React.ReactNode = (
        <>{userIsAuth ? authRoutesNode : publicRoutesNode}</>
    );

    return (
        <>
            {navBarNode}
            <Routes>
                <Route path="/" element={mainPageNode} />
                {routesNode}
            </Routes>
        </>
    );
};

export default MainPage;
