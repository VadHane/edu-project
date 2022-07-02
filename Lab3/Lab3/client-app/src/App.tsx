import React, { FunctionComponent } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { routes } from './routers';

const App: FunctionComponent = () => {
    return (
        <BrowserRouter>
            <Routes>
                {routes.map((route) => (
                    <Route {...route} key={route.path} />
                ))}
            </Routes>
        </BrowserRouter>
    );
};

export default App;
