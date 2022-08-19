import React, { FunctionComponent, useEffect, useState } from 'react';
import { MODEL_DEFAULT_PICTURE } from './../../App.constants';
import { Box, IconButton, Modal, SxProps } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

interface ModalPhotoProps {
    open: boolean;
    urlToPhoto: string;
    onCloseModal?: () => void;
}

const modalWindowStyles: SxProps = {
    display: 'flex',
    //direction: 'row',
    justifyContent: 'center',
    marginTop: '1%',
};

const modalContentStyle: SxProps = {
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '60vw',
    maxHeight: '60vh',
};

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
                <img
                    src={url}
                    onError={onFailedLoadPhoto}
                    style={{
                        display: 'block',
                        maxHeight: '100%',
                        maxWidth: '100%',
                    }}
                />
                <IconButton onClick={props.onCloseModal}>
                    <CancelIcon />
                </IconButton>
            </Box>
        </Modal>
    );
};

export default ModalPhoto;
