import { render } from '@testing-library/react';
import React from 'react';
import ModalImage from './ModalImage';
import { ModalImageProps } from './ModalImage.types';

const props: ModalImageProps = {
    open: false,
    urlToPhoto: '',
};

describe('Test modal photo.', () => {
    test('Snapshot', () => {
        const utils = render(<ModalImage {...props} />);

        expect(utils).toMatchSnapshot();
    });
});
