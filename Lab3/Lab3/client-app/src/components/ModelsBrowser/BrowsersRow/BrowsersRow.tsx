import React, { FunctionComponent, useState } from 'react';
import { Model } from '../../../models/Model';
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
} from './BrowsersRow.constants';
import { collapseTableRowStyles } from './BrowsersRow.styles';

interface BrowsersRowProps {
    model: Model;
}

const BrowsersRow: FunctionComponent<BrowsersRowProps> = ({ model }) => {
    const [open, setOpen] = useState<boolean>(false);

    const onClickPreviewHandler = (preview: string) => {
        return () => {
            console.log('Show pereview');
        };
    };

    const onClickDownloadHandler = (file: string) => {
        return () => {
            console.log('Download model file');
        };
    };

    const collapsibleTableBody: React.ReactNode = (
        <TableBody>
            {model.modelHistory.map((historyRow) => (
                <TableRow key={historyRow.id}>
                    <TableCell component="th" scope="row">
                        {historyRow.createdAt.toLocaleString()}
                    </TableCell>
                    <TableCell>{historyRow.createdBy}</TableCell>
                    <TableCell align="right">
                        <Tooltip title={DOWNLOAD_TITLE} placement="left">
                            <Button onClick={onClickDownloadHandler(historyRow.fileKey)}>
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
                <Collapse in={open} timeout="auto" unmountOnExit>
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
                        <Button onClick={onClickDownloadHandler(model.fileKey)}>
                            {ACTION_LABELES.DOWNLOAD}
                        </Button>
                    </Tooltip>
                </TableCell>
            </TableRow>

            {collapsibleTable}
        </React.Fragment>
    );
};

export default BrowsersRow;
