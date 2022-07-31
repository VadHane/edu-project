import { Button } from '@mui/material';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { RouteNamesEnum } from '../../types/Route.types';
import './MainPage.css';

const MainPage: FunctionComponent = () => {
    const navigate = useNavigate();

    const { isAuth } = useTypedSelector((state) => state.auth);

    const [userIsAuth, setUserIsAuth] = useState<boolean>(false);

    useEffect(() => {
        setUserIsAuth(isAuth);
    }, [isAuth]);

    const onClickLoginHandler = () => {
        navigate(RouteNamesEnum.Login);
    };

    const onClickRegistrationHandler = () => {
        navigate(RouteNamesEnum.Registration);
    };

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

    return <>{mainPageNode}</>;
};

export default MainPage;
