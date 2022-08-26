import { render } from '@testing-library/react';
import React from 'react';
import RegistrationModal from './RegistrationModal';

jest.mock('../../hooks/useTypedSelector', () => ({
    ...jest.requireActual('../../hooks/useTypedSelector'),
    useTypedSelector: () => ({
        roles: [],
        isAuth: false,
        error: null,
        isLoading: false,
    }),
}));

jest.mock('./../../hooks/useAuthActions', () => ({
    ...jest.requireActual('./../../hooks/useAuthActions'),
    useAuthActions: () => ({ registration: jest.fn() }),
}));

jest.mock('../../hooks/useRoleActions', () => ({
    ...jest.requireActual('../../hooks/useRoleActions'),
    useRoleActions: () => ({ getAllRoles: jest.fn() }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useEffect: jest.fn(),
}));

describe('Test modal window for registration.', () => {
    test('Snapshot', () => {
        const utils = render(<RegistrationModal />);

        expect(utils).toMatchSnapshot();
    });
});
