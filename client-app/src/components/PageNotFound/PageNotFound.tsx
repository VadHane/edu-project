import React, { FunctionComponent } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './PageNotFound.css';

const PageNotFound: FunctionComponent = () => {
    const navigation = useNavigate();

    const onClickHandler = () => {
        navigation('/');
    };

    return (
        <div className="text">
            <h1>Page not found.</h1>
            <Button variant="outlined" color="success" onClick={onClickHandler}>
                Go to main page
            </Button>
        </div>
    );
};

export default PageNotFound;
