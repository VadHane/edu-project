import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import AddUserButton from './AddUserButton';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as any),
    useNavigate: () => jest.fn(),
}));

describe('Tests for add users button.', () => {
    afterEach(cleanup);

    test('Component should render without errors.', () => {
        render(<AddUserButton />);

        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('Snapshot.', () => {
        const utils = render(<AddUserButton />);

        expect(utils).toMatchSnapshot();
    });
});
