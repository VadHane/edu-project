import {FunctionComponent} from 'react';
import React, {useNavigate} from 'react-router-dom';
import './AddUserButton.css';

const AddUserButton: FunctionComponent = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate('/add')}>Add new user</button>
  );
};

export default AddUserButton;
