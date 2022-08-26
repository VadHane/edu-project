import { render } from '@testing-library/react';
import React from 'react';
import UserModal from './UserModal';

jest.mock('../../hooks/useTypedSelector', () => ({
    ...jest.requireActual('../../hooks/useTypedSelector'),
    useTypedSelector: () => ({ roles: [], user: undefined }),
}));

jest.mock('../../hooks/useRoleActions', () => ({
    ...jest.requireActual('../../hooks/useRoleActions'),
    useRoleActions: () => ({ getAllRoles: jest.fn(), addNewRole: jest.fn() }),
}));

describe('Test modal window for users table.', () => {
    test('Snapshot', () => {
        const utils = render(
            <UserModal
                resultButtonsCaption={'test'}
                open={true}
                onCloseModalHandler={() => jest.fn()}
                onSendFormHandler={() => jest.fn()}
            />,
        );

        expect(utils).toMatchSnapshot();
    });
});
