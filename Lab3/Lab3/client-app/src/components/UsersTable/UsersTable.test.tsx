import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import UsersTable from './UsersTable';
import { User } from '../../models/User';
import {
    ACTIONS_COLUMN_HEADER,
    EMAIL_COLUMN_HEADER,
    FIRST_NAME_COLUMN_HEADER,
    LAST_NAME_COLUMN_HEADER,
    PICTURE_COLUMN_HEADER,
    ROLES_COLUMN_HEADER,
} from './UsersTable.constants';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as any),
    Routes: jest.fn(),
}));

jest.mock('./TableContentRow');
jest.mock('../UserCreateAndUpdateModal');
jest.mock('../AddUserButton');
jest.mock('../UserWarningModal');

const mockedGetAllUsersAsync = jest.fn();
const mockedGetAllRolesAsync = jest.fn();
const mockedCreateNewRole = jest.fn();
const mockedCreateUserAsync = jest.fn();
const mockedEditUserAsync = jest.fn();
const mockedDeleteUserAsync = jest.fn();

const UsersTableNode: React.ReactNode = (
    <UsersTable
        getAllUsersAsync={mockedGetAllUsersAsync}
        getAllRolesAsync={mockedGetAllRolesAsync}
        createNewRole={mockedCreateNewRole}
        createUserAsync={mockedCreateUserAsync}
        editUserAsync={mockedEditUserAsync}
        deleteUserAsync={mockedDeleteUserAsync}
    />
);

describe('Test users table.', () => {
    beforeEach(() => {
        mockedGetAllUsersAsync.mockReturnValue(new Promise<Array<User>>(() => []));
    });

    afterEach(cleanup);

    test('Component shuld render without errors.', () => {
        render(<>{UsersTableNode}</>);

        expect(
            screen.getByRole('columnheader', { name: PICTURE_COLUMN_HEADER }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('columnheader', { name: FIRST_NAME_COLUMN_HEADER }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('columnheader', { name: LAST_NAME_COLUMN_HEADER }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('columnheader', { name: EMAIL_COLUMN_HEADER }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('columnheader', { name: ROLES_COLUMN_HEADER }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('columnheader', { name: ACTIONS_COLUMN_HEADER }),
        ).toBeInTheDocument();
    });

    test('Snapshot.', () => {
        const utils = render(<>{UsersTableNode}</>);

        expect(utils).toMatchSnapshot();
    });
});
