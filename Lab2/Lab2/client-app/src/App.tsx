import React, {FunctionComponent} from 'react';
import {BrowserRouter} from 'react-router-dom';
import UserSTable from './components/UsersTable/UsersTable';
import './App.css';

const App: FunctionComponent = () => {
  return (
    <BrowserRouter>
      <div className="">
        <UserSTable />

      </div>
    </BrowserRouter>
  );
};

export default App;
