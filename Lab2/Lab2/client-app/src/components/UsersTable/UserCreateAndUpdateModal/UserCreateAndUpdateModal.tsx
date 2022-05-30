import React, {FunctionComponent, useEffect, useState} from 'react';
import {NavLink} from 'react-router-dom';
import {Role} from '../../../models/Role';
import AddedRolesList from './AddedRolesList/AddedRolesList';
import AvailableRolesList from './AvailableRolesList/AvailableRolesList';
import UserCreateAndUpdateModalProps from './UserCreateAndUpdateModal.types';
import './UserCreateAndUpdateModal.css';

const UserCreateAndUpdateModal:
FunctionComponent<UserCreateAndUpdateModalProps> =
(props: UserCreateAndUpdateModalProps) => {
  const [firstName, setFirstName] = useState<string>(props.user.firstName);
  const [lastName, setLastName] = useState<string>(props.user.lastName);
  const [email, setEmail] = useState<string>(props.user.email);
  const [addedRoles, setAddedRoles] = useState<Array<Role>>(props.user.roles);
  const [availableRoles, setAvailableRoles] = useState<Array<Role>>([]);

  const file = React.createRef<HTMLInputElement>();

  useEffect(() => {
    props.getAllRolesAsync().then((roles: Array<Role>) =>
      setAvailableRoles([...roles]));
  }, []);

  const backgroundNode: React.ReactNode = (
    <NavLink to={'/'} title='Close modal window'>
      <div className="background"></div>
    </NavLink>
  );

  const modalWindowNode: React.ReactNode = (
    <div className="window">
      <form>
        <div className="formRows">
          <img src={props.user.imageBlobKey !== '' ? props.user.imageBlobKey : 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png'} />
          <br/>
          <input type="text"
            name='title'
            id='title'
            placeholder='First name'
            value={firstName}
            onChange={(event) => {
              setFirstName(event.target.value);
            }}/><br/>

          <input type="text"
            name='title'
            id='title'
            placeholder='Last name'
            value={lastName}
            onChange={(event) => {
              setLastName(event.target.value);
            }}/><br/>

          <input type="email"
            name='title'
            id='title'
            placeholder='email'
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}/><br/>

          <AddedRolesList
            roles={addedRoles}
            removeAddedRole={(role: Role) => addAvailableRole(role)} />

          <AvailableRolesList
            roles={availableRoles}
            addedRoles={addedRoles}
            addRole={(role: Role) => addRole(role)}
            createNewRole={(role: Role) => createNewRole(role)}/>

          <input type="file" ref={file}/>

          <NavLink to={'/'}>
            <button onClick={() => {
              props.addUserAsync({
                id: '',
                firstName: firstName,
                lastName: lastName,
                email: email,
                imageBlobKey: props.user.imageBlobKey,
                roles: addedRoles,
              }, file.current?.files?.item(0));
            }}>
              {props.btnCaption}
            </button>
          </NavLink>
        </div>
      </form>
    </div>
  );

  const addRole = (role: Role): void => {
    setAvailableRoles((currentValue: Array<Role>) => {
      const indexOfSelectedRole = currentValue?.findIndex(
          (_role: Role) => _role.id === role.id);
      const prevList = currentValue.slice(0, indexOfSelectedRole);
      const endList = currentValue.slice(
          indexOfSelectedRole+1, currentValue.length);

      return [...prevList, ...endList];
    });
    setAddedRoles((currentValue) => [...currentValue, role]);
  };

  const addAvailableRole = (role: Role) => {
    setAddedRoles((currentValue: Array<Role>) => {
      const indexOfSelectedRole = currentValue?.findIndex(
          (_role: Role) => _role.id === role.id);
      const prevList = currentValue.slice(0, indexOfSelectedRole);
      const endList = currentValue.slice(
          indexOfSelectedRole+1, currentValue.length);

      return [...prevList, ...endList];
    });
    setAvailableRoles((currentValue) => [...currentValue, role]);
  };

  const createNewRole = (role: Role): void => {
    props.createNewRole(role).then((role: Role) => {
      setAvailableRoles((currentValue: Array<Role>) =>
        [...currentValue, role]);
    });
  };

  return (
    <div className="wrapper">
      {backgroundNode}
      {modalWindowNode}
    </div>
  );
};

export default UserCreateAndUpdateModal;
