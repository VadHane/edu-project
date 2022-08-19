import React, { FunctionComponent, useEffect, useState } from 'react';
import { MODEL_DEFAULT_PICTURE } from './../../App.constants';
import { Box, IconButton, Modal } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { modalWindowStyles, modalContentStyle, imgStyles } from './ModalPhoto.styles';
import { ModalPhotoProps } from './ModalPhoto.types';

const ModalPhoto: FunctionComponent<ModalPhotoProps> = (props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [url, setUrl] = useState<string>('');

    useEffect(() => {
        setOpen(props.open);
        setUrl(props.urlToPhoto);
    }, [props]);

    const onFailedLoadPhoto = () => {
        setUrl(MODEL_DEFAULT_PICTURE.URL);
    };

    const onCloseModalHandler = () => {
        props.onCloseModal && props.onCloseModal();
    };

    return (
        <Modal open={open} onClose={onCloseModalHandler} sx={modalWindowStyles}>
            <Box sx={modalContentStyle}>
                <img src={url} onError={onFailedLoadPhoto} style={imgStyles} />
                <IconButton onClick={props.onCloseModal}>
                    <CancelIcon />
                </IconButton>
            </Box>
        </Modal>
    );
};

export default ModalPhoto;
