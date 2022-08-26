import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import UsersTable from './UsersTable';
import '@testing-library/jest-dom';

jest.mock('../../hooks/useTypedSelector', () => ({
    ...jest.requireActual('../../hooks/useTypedSelector'),
    useTypedSelector: () => ({ users: [] }),
}));

describe('Test users table.', () => {
    test('Snapshot.', () => {
        const utils = render(
            <UsersTable
                onAddUserHandler={() => jest.fn()}
                onEditUserHandler={jest.fn()}
            />,
        );

        expect(utils).toMatchSnapshot();
    });
});
