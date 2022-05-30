import React, {FunctionComponent, useEffect, useState} from 'react';
import {Role} from '../../../../models/Role';
import AvailableRolesListProps from './AvailableRolesList.types';
import './AvailableRolesList.css';

const AvailableRolesList: FunctionComponent<AvailableRolesListProps> =
(props: AvailableRolesListProps) => {
  const [roles, setRoles] = useState<Array<Role>>(props.roles);
  const [inputNameOfRole, setInputNameOfRole] = useState<string>('');
  const [itNewRole, setItNewRole] = useState<boolean>(false);
  const [itAddedRole, setItAddedRole] = useState<boolean>(false);

  useEffect(() => {
    setRoles([...props.roles]);
  }, [props.roles.length]);

  useEffect(() => {
    let availableInList: boolean = !roles.find(
        (role: Role) => role.name === inputNameOfRole);
    availableInList = availableInList && inputNameOfRole.length > 1;

    const added: boolean = props.addedRoles.find(
        (role: Role) => role.name === inputNameOfRole) ?
        true : false;

    setItNewRole(availableInList);
    setItAddedRole(added);
  }, [inputNameOfRole]);

  const inputBox: React.ReactNode = (
    <div>
      <datalist id="available-roles-list">
        {roles?.map((role: Role) => (
          <option value={role.name} key={role.id}></option>
        ))}
      </datalist>
      <input type="text" list='available-roles-list'
        value={inputNameOfRole}
        maxLength={30}
        onChange={(e) => setInputNameOfRole(e.target.value)}/>
    </div>
  );

  const aproveAddingNewRole: React.ReactNode = (
    <div className='aprove-add-role'>
      <span>Would you like to create new role - {inputNameOfRole}?</span> <br />
      <img src="https://cdn-icons-png.flaticon.com/512/1828/1828743.png"
        alt="Aprove"
        onClick={() => {
          debugger;
          props.createNewRole({id: '', name: inputNameOfRole});
          setItNewRole(false);
        }}/>
      <img
        src="https://cdn-icons-png.flaticon.com/512/1828/1828939.png"
        alt="Cancel"
        onClick={() => setInputNameOfRole('')}/>
    </div>
  );

  const approveAddingAvailableRole: React.ReactNode = (
    <div className='aprove-add-role'>
      <span>Would you like to add this role?</span> <br />
      <img
        src="https://cdn-icons-png.flaticon.com/512/1828/1828743.png"
        alt="Aprove"
        onClick={() => {
          props.addRole(getRoleByName(inputNameOfRole));
          setInputNameOfRole('');
        }}/>
      <img
        src="https://cdn-icons-png.flaticon.com/512/1828/1828939.png"
        alt="Cancel"
        onClick={() => setInputNameOfRole('')}/>
    </div>
  );

  const roleWasAdd: React.ReactNode = (
    <div>
      <span>Roles list consist this role.</span> <br />
      <img
        src="https://cdn-icons-png.flaticon.com/512/1828/1828743.png"
        alt="Ok"
        onClick={() => setInputNameOfRole('')}/>
    </div>
  );

  const getRoleByName = (roleName: String): Role => {
    const index = roles.findIndex((role: Role) => role.name === roleName);
    return roles[index];
  };

  return (
    <div>
      {inputBox}
      {itAddedRole ? roleWasAdd :
        inputNameOfRole.length > 1 ?
          !itNewRole ? approveAddingAvailableRole :
          aproveAddingNewRole : ''}
    </div>
  );
};

export default AvailableRolesList;
