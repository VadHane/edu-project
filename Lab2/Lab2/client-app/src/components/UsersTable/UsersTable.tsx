import React, {FunctionComponent, useEffect, useState} from 'react';
import {User} from '../../models/User';
import {Role} from '../../models/Role';
import {getAllUsersAsync} from '../../services/userService';
import TableContentRow from './TableContentRow/TableContentRow';
import {Route, Routes} from 'react-router-dom';
import UserCreateAndUpdateModal from
  './UserCreateAndUpdateModal/UserCreateAndUpdateModal';
import AddUserButton from './AddUserButton/AddUserButton';
import UsersTableProps from './UsersTable.types';
import './UsersTable.css';

const UsersTable: FunctionComponent<UsersTableProps> = (props) => {
  const [users, setUsers] = useState<Array<User>>([]);

  useEffect(() => {
    getAllUsersAsync().then((data: Array<User>) =>{
      setUsers(data);
    });
  }, []);

  const usersRowsNode: React.ReactNode = (
    <div className="scroll-list">
      <table>
        <tbody>
          {users.map((user: User): JSX.Element => (
            <TableContentRow
              key={user.id}
              user={user}
              onEdit={(id: string) => console.log(`Edit user with id = ${id}`)}
              onDelete={(id: string) =>
                console.log(`Delete user with id = ${id}`)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );

  const tableHeaderNode: React.ReactNode = (
    <table>
      <thead>
        <tr>
          <th className="picture">Picture</th>
          <th className="name">First name</th>
          <th className="surname">Last name</th>
          <th className="email">Email</th>
          <th className='roles'>Roles</th>
          <th className="actions">Actions</th>
        </tr>
      </thead>
    </table>
  );

  const addUser = (user: User, image: File): Promise<boolean> => {
    return props.createUserAsync(user, image)
        .then((data: User): boolean => {
          if (data) {
            setUsers((currentValue: Array<User>) => [...currentValue, data]);
            return true;
          }
          return false;
        })
        .catch(() => false);
  };

  const emptyUser: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    imageBlobKey: '',
    roles: [],
  };

  return (
    <div className="list">

      <Routes>
        <Route path='/add' element={
          <UserCreateAndUpdateModal
            user={emptyUser}
            btnCaption={'Add new user'}
            getAllRolesAsync={() => props.getAllRolesAsync()}
            createNewRole={(role: Role) => props.createNewRole(role)}
            resultActionAsync={(user: User, file: File) =>
              addUser(user, file)}
          />}/>
      </Routes>

      <AddUserButton />
      {tableHeaderNode}
      {usersRowsNode}
    </div>
  );
};

export default UsersTable;
