import React, { FunctionComponent, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
    PREVIEW_TITLE,
    DOWNLOAD_TITLE,
    ACTION_LABELES,
    COLLAPSE_ROW_HEADER_LABEL,
    DATE_LABEL,
    USER_LABEL,
    PREVIEW3D_TITLE,
} from './BrowsersRow.constants';
import { collapseTableRowStyles } from './BrowsersRow.styles';
import { getUserByIdAsync } from '../../../services/userService';
import { signUrl } from '../../../services/fileService';
import ModalPhoto from '../../ModalImage';
import { saveAs } from 'file-saver';
import { BrowsersRowProps } from './BrowsersRow.types';
import { RouteNamesEnum } from '../../../types/Route.types';
import { useNavigate } from 'react-router-dom';

const fileStorageUrl = `${process.env.REACT_APP_FILE_STORAGE_URL}/api/file/`;

const BrowsersRow: FunctionComponent<BrowsersRowProps> = ({ model }) => {
    const [open, setOpen] = useState<boolean>(false);

    const [ownerName, setOwnerName] = useState<string>('');

    const [previewIsOpen, setPreviewIsOpen] = useState<boolean>(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        if (!model.createdBy) {
            return;
        }

        getUserByIdAsync(model.createdBy).then((user) =>
            setOwnerName(`${user.firstName} ${user.lastName}`),
        );
    });

    const onClickPreviewHandler = (previewUrl: string) => () => {
        const photoUrl = `${fileStorageUrl}${previewUrl}`;

        signUrl(photoUrl)
            .then((signedUrl) => {
                setPreviewUrl(signedUrl);
            })
            .then(() => {
                setPreviewIsOpen(true);
            });
    };

    const onClosePreviewModalHandler = () => {
        setPreviewIsOpen(false);
    };

    const onClickDownloadHandler =
        (file: string, modelName: string, index: number) => () => {
            const fileUrl = `${fileStorageUrl}${file}`;

            signUrl(fileUrl).then((signedUrl) => {
                const fileName = `${modelName}_v${index}.obj`; //! It is solution only for .obj files!

                saveAs(signedUrl, fileName);
            });
        };

    const collapsibleTableBody: React.ReactNode = (
        <TableBody>
            {model.modelHistory.map((historyRow) => (
                <TableRow key={historyRow.id}>
                    <TableCell component="th" scope="row" align="center">
                        {new Date(historyRow.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell align="center">{ownerName}</TableCell>
                    <TableCell align="center">
                        <Tooltip title={DOWNLOAD_TITLE} placement="left">
                            <Button
                                onClick={onClickDownloadHandler(
                                    historyRow.fileKey,
                                    model.name,
                                    new Date(historyRow.createdAt).getMilliseconds(),
                                )}
                            >
                                {ACTION_LABELES.DOWNLOAD}
                            </Button>
                        </Tooltip>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );

    const collapsibleTable: React.ReactNode = (
        <TableRow>
            <TableCell style={collapseTableRowStyles} colSpan={4}>
                <Collapse in={open} timeout="auto">
                    <Box sx={{ margin: 1 }}>
                        <Typography
                            variant="h6"
                            gutterBottom
                            component="div"
                            align="center"
                        >
                            {COLLAPSE_ROW_HEADER_LABEL}
                        </Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">{DATE_LABEL}</TableCell>
                                    <TableCell align="center">{USER_LABEL}</TableCell>
                                    <TableCell align="center"></TableCell>
                                </TableRow>
                            </TableHead>

                            {collapsibleTableBody}
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    );

    const previewModal: React.ReactNode = (
        <ModalPhoto
            open={previewIsOpen}
            urlToPhoto={previewUrl}
            onCloseModal={onClosePreviewModalHandler}
        />
    );

    return (
        <React.Fragment>
            <TableRow>
                <TableCell component="th" scope="row" align="left">
                    <IconButton
                        onClick={() => setOpen(!open)}
                        sx={{ marginRight: '20%' }}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowRight />}
                    </IconButton>
                    {model.name}
                </TableCell>
                <TableCell align="center">{model.description}</TableCell>
                <TableCell align="center">
                    {model.tags.map((tag) => `${tag.name}; `)}
                </TableCell>
                <TableCell align="center">
                    <Tooltip title={PREVIEW_TITLE} placement="left">
                        <Button onClick={onClickPreviewHandler(model.prevBlobKey)}>
                            {ACTION_LABELES.PREVIEW}
                        </Button>
                    </Tooltip>

                    <Tooltip title={DOWNLOAD_TITLE} placement="right">
                        <Button
                            onClick={onClickDownloadHandler(
                                model.filekey,
                                model.name,
                                new Date(model.updatedAt).getMilliseconds(),
                            )}
                        >
                            {ACTION_LABELES.DOWNLOAD}
                        </Button>
                    </Tooltip>

                    <Tooltip title={PREVIEW3D_TITLE} placement="right-end">
                        <Button
                            onClick={() =>
                                navigate(
                                    `${RouteNamesEnum.ModelViewerForNavigate}${model.id}`,
                                )
                            }
                        >
                            {ACTION_LABELES.PREVIEW_3D}
                        </Button>
                    </Tooltip>
                </TableCell>
            </TableRow>

            {collapsibleTable}
            {previewModal}
        </React.Fragment>
    );
};

export default BrowsersRow;
