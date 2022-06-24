import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import App from './App';

const testString = 'Users table has been rended.';

jest.mock('./components/UsersTable', () => () => {
    return (
        <>
            <b>{testString}</b>
        </>
    );
});

describe('Test app.', () => {
    afterEach(cleanup);

    test('Component should render without errors.', () => {
        render(<App />);

        expect(screen.getByText(testString)).toBeInTheDocument();
    });

    test('Snaphot.', () => {
        const utils = render(<App />);

        expect(utils).toMatchSnapshot();
    });
});
