import { SxProps } from '@mui/material';

export const modalWindowStyles: SxProps = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
};

export const contentStyle: SxProps = {
    m: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

export const inputFieldStyle: SxProps = {
    width: '100%',
};

export const preloaderStyles: SxProps = {
    display: 'flex',
    justifyContent: 'center',
    m: '30px 0 30px 0',
};
