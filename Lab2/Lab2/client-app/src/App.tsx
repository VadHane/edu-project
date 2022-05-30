import React, {FunctionComponent} from 'react';
import UsersTable from './components/UsersTable/UsersTable';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {createNewRole, getAllRolesAsync} from './services/roleService';
import {Role} from './models/Role';
import {deleteImageAsync, postImageAsync} from './services/imageServise';
import {User} from './models/User';
import {addUserAsync} from './services/userService';


const App: FunctionComponent = () => {
  return (
    <BrowserRouter>
      <div className="">
        <Routes>
          <Route path='*' element={
            <UsersTable
              getAllRolesAsync={() => getAllRolesAsync()}
              createNewRole={(role: Role) => createNewRole(role)}
              deleteImageAsync={(imageBlobKey: string) =>
                deleteImageAsync(imageBlobKey)}
              postImageAsync={(image: File) => postImageAsync(image)}
              addUserAsync={(user: User, file: File) =>
                addUserAsync(user, file)}
            />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
