import React from 'react';
import { render } from '@testing-library/react';
import Header from './Header';

jest.mock('../../hooks/useTypedSelector', () => ({
    ...jest.requireActual('../../hooks/useTypedSelector'),
    useTypedSelector: () => ({ user: {}, isAuth: false }),
}));

jest.mock('./../../hooks/useAuthActions', () => ({
    ...jest.requireActual('./../../hooks/useAuthActions'),
    useAuthActions: () => ({ logout: jest.fn() }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
    Outlet: () => <></>,
    NavLink: () => <></>,
}));

describe('Test header.', () => {
    test('Snapshot', () => {
        const utils = render(<Header />);

        expect(utils).toMatchSnapshot();
    });
});
