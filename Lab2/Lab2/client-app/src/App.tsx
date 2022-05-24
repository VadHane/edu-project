import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import UserList from './components/UserList/UsersTable';
import './App.css';

/**
 *  The main component of this site.
 * @return {JSX.Element} JSX
 */
function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div className="">
        <UserList />

      </div>
    </BrowserRouter>
  );
}

export default App;
