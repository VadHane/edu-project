import React, { FunctionComponent } from 'react';
import UsersTable from './components/UsersTable';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createNewRole, getAllRolesAsync } from './services/roleService';
import { Role } from './models/Role';
import { User } from './models/User';
import {
    addUserAsync,
    deleteUserAsync,
    editUserAsync,
    getAllUsersAsync,
} from './services/userService';

const App: FunctionComponent = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="*"
                    element={
                        <UsersTable
                            getAllUsersAsync={getAllUsersAsync}
                            getAllRolesAsync={getAllRolesAsync}
                            createNewRole={(role: Role) => createNewRole(role)}
                            createUserAsync={(user: User, file: File) =>
                                addUserAsync(user, file)
                            }
                            editUserAsync={(user: User, file: File) =>
                                editUserAsync(user, file)
                            }
                            deleteUserAsync={(user: User) => deleteUserAsync(user)}
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
