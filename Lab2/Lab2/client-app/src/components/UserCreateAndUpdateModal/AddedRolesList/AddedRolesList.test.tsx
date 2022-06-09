import React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { Role } from '../../../models/Role';
import AddedRolesList from './AddedRolesList';
import { REMOVE_IMAGE } from '../../../App.constants';

const mockedRemoveAddedRole = jest.fn();
const testRoleList: Array<Role> = [
    {
        id: '1234',
        name: 'TestRole',
    },
];

describe('Test added roles list.', () => {
    afterEach(cleanup);

    test('Component should render without errors.', () => {
        render(
            <AddedRolesList
                roles={testRoleList}
                removeAddedRole={mockedRemoveAddedRole}
            />,
        );

        expect(screen.getByText(testRoleList[0].name)).toBeInTheDocument();
        expect(screen.getByAltText(REMOVE_IMAGE.ALT)).toBeInTheDocument();
    });

    test('Component should render correct without data.', () => {
        render(<AddedRolesList roles={[]} removeAddedRole={mockedRemoveAddedRole} />);

        expect(screen.queryByAltText(REMOVE_IMAGE.ALT)).toBeNull();
    });

    test('Click action for remove button should call handler from props.', () => {
        render(
            <AddedRolesList
                roles={testRoleList}
                removeAddedRole={mockedRemoveAddedRole}
            />,
        );

        fireEvent.click(screen.getByAltText(REMOVE_IMAGE.ALT));

        expect(mockedRemoveAddedRole).toBeCalledTimes(1);
    });

    test('Snapshot with data.', () => {
        const utils = render(
            <AddedRolesList
                roles={testRoleList}
                removeAddedRole={mockedRemoveAddedRole}
            />,
        );

        expect(utils).toMatchSnapshot();
    });

    test('Snapshot without data.', () => {
        const utils = render(
            <AddedRolesList roles={[]} removeAddedRole={mockedRemoveAddedRole} />,
        );

        expect(utils).toMatchSnapshot();
    });
});
