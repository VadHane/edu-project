import React, { FunctionComponent, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAuthActions } from './hooks/useAuthActions';
import MainPage from './pages/MainPage/MainPage';

const App: FunctionComponent = () => {
    const { initialAuth } = useAuthActions();

    useEffect(() => {
        initialAuth();
    }, []);

    return (
        <BrowserRouter>
            <MainPage />
        </BrowserRouter>
    );
};

export default App;
