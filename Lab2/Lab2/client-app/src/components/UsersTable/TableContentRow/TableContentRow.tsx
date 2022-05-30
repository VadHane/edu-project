import React, {useState, useEffect, FunctionComponent} from 'react';
import {Role} from '../../../models/Role';
import {User} from '../../../models/User';
import {TableContentRowProps} from './TableContentRow.types';
import './TableContentRow.css';

const TableContentRow: FunctionComponent<TableContentRowProps> = (props) => {
  const [user, setUser] = useState<User>(props.user);

  useEffect(() => {
    setUser(props.user);
  }, [props.user]);

  const getImagePath = (): string => {
    if (props.user.imageBlobKey !== '/') {
      return 'https://localhost:44303/' + props.user.imageBlobKey;
    }

    return 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png';
  };

  return (
    <tr>
      <th className="picture">
        <img src={getImagePath()} alt="UserPhoto" />
      </th>
      <th className="name">{user.firstName}</th>
      <th className="surname">{user.lastName}</th>
      <th className="email">{user.email}</th>
      <th className='roles'>
        {
          user.roles.map((role: Role): string => `${role.name}; `)
        }
      </th>
      <th className="actions">
        <img
          src="https://cdn-icons-png.flaticon.com/512/61/61456.png"
          alt="Edit"
          onClick={() => props.onEdit(user.id)}
        />
        <img
          src="https://cdn-icons.flaticon.com/png/512/484/premium/484611.png?token=exp=1653900152~hmac=38656b6a00192dd1df917508e424bddb"
          alt="Delete"
          onClick={() => props.onDelete(user.id)}
        />
      </th>
    </tr>
  );
};

export default TableContentRow;
