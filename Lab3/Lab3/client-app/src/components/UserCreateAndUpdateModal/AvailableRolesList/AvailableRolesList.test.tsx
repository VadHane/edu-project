import React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { Role } from '../../../models/Role';
import AvailableRolesList from './AvailableRolesList';
import { APPROVE_IMAGE, CANCEL_IMAGE } from '../../../App.constants';
import {
    ADD_ROLE_MESSAGE,
    GET_CREATE_ROLE_MESSAGE,
    LIST_INCLUDES_ROLE_MESSAGE,
} from './AvailableRolesList.constants';

const mockedAddRole = jest.fn();
const mockedCreateRole = jest.fn();
const testRolesList: Array<Role> = [
    {
        id: '1234',
        name: 'TestRole1',
    },
    {
        id: '5678',
        name: 'TestRole2',
    },
];
const testAddedRolesList: Array<Role> = [
    {
        id: '0000',
        name: 'TestAddedRole3',
    },
];

describe('Test available role list', () => {
    afterEach(cleanup);

    test('Component should render without errors.', () => {
        render(
            <AvailableRolesList
                roles={testRolesList}
                addedRoles={testAddedRolesList}
                addRole={mockedAddRole}
                createNewRole={mockedCreateRole}
            />,
        );

        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    test('Component should render correct without data.', () => {
        render(
            <AvailableRolesList
                roles={[]}
                addedRoles={[]}
                addRole={mockedAddRole}
                createNewRole={mockedCreateRole}
            />,
        );

        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    test('Component should handle typing action.', () => {
        render(
            <AvailableRolesList
                roles={testRolesList}
                addedRoles={testAddedRolesList}
                addRole={mockedAddRole}
                createNewRole={mockedCreateRole}
            />,
        );

        const testInputValue = 'test_value_1234';

        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: testInputValue },
        });

        expect(screen.getByDisplayValue(testInputValue)).toBeInTheDocument();
    });

    test('Component should include message about creating new role, if there is inputted name of role, witch dont contains in rolles list.', () => {
        render(
            <AvailableRolesList
                roles={testRolesList}
                addedRoles={testAddedRolesList}
                addRole={mockedAddRole}
                createNewRole={mockedCreateRole}
            />,
        );

        const testInputValue = 'test_value_1234';

        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: testInputValue },
        });

        expect(screen.getByText(GET_CREATE_ROLE_MESSAGE)).toBeInTheDocument();
        expect(screen.getByRole('img', { name: APPROVE_IMAGE.ALT })).toBeInTheDocument();
        expect(screen.getByRole('img', { name: CANCEL_IMAGE.ALT })).toBeInTheDocument();
    });

    test('Component should not include message about creating new role, if inputted length of name of role is less then 2 symbols.', () => {
        render(
            <AvailableRolesList
                roles={testRolesList}
                addedRoles={testAddedRolesList}
                addRole={mockedAddRole}
                createNewRole={mockedCreateRole}
            />,
        );

        const testInputValue = 't';

        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: testInputValue },
        });

        expect(screen.queryByText(GET_CREATE_ROLE_MESSAGE)).toBeNull();
        expect(screen.queryByRole('img', { name: APPROVE_IMAGE.ALT })).toBeNull();
        expect(screen.queryByRole('img', { name: CANCEL_IMAGE.ALT })).toBeNull();
    });

    test('Component should include message about adding new role, if there is inputted name of role, witch contains in rolles list.', () => {
        render(
            <AvailableRolesList
                roles={testRolesList}
                addedRoles={testAddedRolesList}
                addRole={mockedAddRole}
                createNewRole={mockedCreateRole}
            />,
        );

        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: testRolesList[0].name },
        });

        expect(screen.getByText(ADD_ROLE_MESSAGE)).toBeInTheDocument();
        expect(screen.getByRole('img', { name: APPROVE_IMAGE.ALT })).toBeInTheDocument();
        expect(screen.getByRole('img', { name: CANCEL_IMAGE.ALT })).toBeInTheDocument();
    });

    test('Component should include warning message about adding new role, witch was added in past.', () => {
        render(
            <AvailableRolesList
                roles={testRolesList}
                addedRoles={testAddedRolesList}
                addRole={mockedAddRole}
                createNewRole={mockedCreateRole}
            />,
        );

        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: testAddedRolesList[0].name },
        });

        expect(screen.getByText(LIST_INCLUDES_ROLE_MESSAGE)).toBeInTheDocument();
        expect(screen.getByRole('img', { name: APPROVE_IMAGE.ALT })).toBeInTheDocument();
    });

    test('Available roles list Snapshots.', () => {
        const componentWithData = render(
            <AvailableRolesList
                roles={testRolesList}
                addedRoles={testAddedRolesList}
                addRole={mockedAddRole}
                createNewRole={mockedCreateRole}
            />,
        ).container;
        const componentWithoutData = render(
            <AvailableRolesList
                roles={[]}
                addedRoles={[]}
                addRole={mockedAddRole}
                createNewRole={mockedCreateRole}
            />,
        ).container;

        expect(componentWithData).toMatchSnapshot();
        expect(componentWithoutData).toMatchSnapshot();
    });

    test('Snapshots with warning messages about added roles in past.', () => {
        const utils = render(
            <AvailableRolesList
                roles={testRolesList}
                addedRoles={testAddedRolesList}
                addRole={mockedAddRole}
                createNewRole={mockedCreateRole}
            />,
        );

        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: testAddedRolesList[0].name },
        });

        expect(utils).toMatchSnapshot();
    });

    test('Snapshots with messages about create new role.', () => {
        const utils = render(
            <AvailableRolesList
                roles={testRolesList}
                addedRoles={testAddedRolesList}
                addRole={mockedAddRole}
                createNewRole={mockedCreateRole}
            />,
        );
        const testInputValue = 'test_value_1234';

        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: testInputValue },
        });

        expect(utils).toMatchSnapshot();
    });

    test('Snapshots with warning messages about adding available role.', () => {
        const utils = render(
            <AvailableRolesList
                roles={testRolesList}
                addedRoles={testAddedRolesList}
                addRole={mockedAddRole}
                createNewRole={mockedCreateRole}
            />,
        );

        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: testRolesList[0].name },
        });

        expect(utils).toMatchSnapshot();
    });
});
