import React, { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteNamesEnum } from '../../types/Route.types';
import { ADD_USER_BUTTON_TEXT } from '../UsersTable/UsersTable.constants';
import './AddUserButton.css';

const AddUserButton: FunctionComponent = () => {
    const navigate = useNavigate();

    const onClickHandler = () => {
        navigate(RouteNamesEnum.AddUser);
    };

    return <button onClick={onClickHandler}>{ADD_USER_BUTTON_TEXT}</button>;
};

export default AddUserButton;
