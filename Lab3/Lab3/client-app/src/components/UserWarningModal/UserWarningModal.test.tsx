import React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import UserWarningModal from './UserWarningModal';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as any),
    useNavigate: () => jest.fn(),
}));

describe('Test warning modal window.', () => {
    afterEach(cleanup);

    test('Component should render without errors.', () => {
        const testMessage = 'test message';

        render(<UserWarningModal message={testMessage} />);

        expect(screen.getByText(testMessage)).toBeInTheDocument();
        expect(screen.getByText(/ok/i)).toBeInTheDocument();
    });

    test('Click handler should was called, after user click on button.', () => {
        const testMessage = 'test message';
        const mockedClickHandler = jest.fn();

        render(<UserWarningModal message={testMessage} onClick={mockedClickHandler} />);

        fireEvent.click(screen.getByText(/ok/i));

        expect(mockedClickHandler).toBeCalledTimes(1);
    });

    test('Snapshot.', () => {
        const testMessage = 'test message';
        const utils = render(<UserWarningModal message={testMessage} />);

        expect(utils).toMatchSnapshot();
    });
});
