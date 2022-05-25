import React, {FunctionComponent, useEffect, useState} from 'react';
import {User} from '../../models/User';
import {getAllUsers} from '../../services/userService';
import TableContentRow from './TableContentRow/TableContentRow';
import './UsersTable.css';

const UsersTable: FunctionComponent = () => {
  const [users, setUsers] = useState<Array<User>>([]);

  useEffect(() => {
    getAllUsers().then((data: Array<User>) =>{
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

  return (
    <div className="list">
      {tableHeaderNode}
      {usersRowsNode}
    </div>
  );
};

export default UsersTable;
