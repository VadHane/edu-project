import { render } from '@testing-library/react';
import React from 'react';
import LoginModal from './LoginModal';

jest.mock('../../hooks/useTypedSelector', () => ({
    ...jest.requireActual('../../hooks/useTypedSelector'),
    useTypedSelector: () => ({ isAuth: false, error: null, isLoading: false }),
}));

jest.mock('./../../hooks/useAuthActions', () => ({
    ...jest.requireActual('./../../hooks/useAuthActions'),
    useAuthActions: () => ({ authorization: jest.fn() }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Test modal window for login.', () => {
    test('Snapshot', () => {
        const utils = render(<LoginModal />);

        expect(utils).toMatchSnapshot();
    });
});
