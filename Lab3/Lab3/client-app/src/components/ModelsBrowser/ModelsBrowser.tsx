import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    styled,
    tableCellClasses,
    CircularProgress,
} from '@mui/material';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Model } from '../../models/Model';
import BrowsersRow from './BrowsersRow/BrowsersRow';
import {
    MODEL_NAME_LABEL,
    DESCRIPTION_LABEL,
    TAGS_LABEL,
    ACTIONS_LABEL,
    tableHeadBackgroundColor,
    tableHeadTextColor,
} from './ModelsBrowser.constants';
import { paperStyles, tableContainerStyles, tableStyles } from './ModelsBrowser.styles';
import { ModelsBrowserProps } from './ModelsBrowser.types';

const ModelsBrowser: FunctionComponent<ModelsBrowserProps> = (
    props: ModelsBrowserProps,
) => {
    const [models, setModels] = useState<Array<Model>>([]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setModels([...props.models]);
    }, [props.models]);

    useEffect(() => {
        setIsLoading(props.isLoading);
    }, [props.isLoading]);

    const StyledTableCell = styled(TableCell)(() => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: tableHeadBackgroundColor,
            color: tableHeadTextColor,
            textAlignLast: 'center',
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const tablesBody: React.ReactNode = (
        <>
            {models.length > 0 ? (
                models.map((model) => <BrowsersRow key={model.id} model={model} />)
            ) : (
                <TableRow>
                    <TableCell align="center" colSpan={4}>
                        Not Found
                    </TableCell>
                </TableRow>
            )}
        </>
    );

    return (
        <Paper sx={paperStyles}>
            <TableContainer sx={tableContainerStyles}>
                <Table stickyHeader sx={tableStyles}>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>{MODEL_NAME_LABEL}</StyledTableCell>
                            <StyledTableCell>{DESCRIPTION_LABEL}</StyledTableCell>
                            <StyledTableCell>{TAGS_LABEL}</StyledTableCell>
                            <StyledTableCell>{ACTIONS_LABEL}</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell align="center" colSpan={4}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : (
                            tablesBody
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default ModelsBrowser;
