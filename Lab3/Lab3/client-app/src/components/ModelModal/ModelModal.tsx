import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTypedSelector } from './../../hooks/useTypedSelector';
import { useTagActions } from './../../hooks/useTagActions';
import { ModelsFileExtensions, Nullable } from '../../types/App.types';
import {
    FILE_NOT_CAD_EXCEPTION,
    FILE_NOT_IMAGE_EXCEPTION,
    LENGTH_OF_DESCRIPTION_EXCEPTION,
    LENGTH_OF_NAME_EXCEPTION,
    UNKNOWN_EXCEPTION,
} from '../../exceptions';
import { Model } from '../../models/Model';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    Modal,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import {
    preloaderStyles,
    inputFieldStyle,
    contentStyle,
    modalWindowStyles,
} from './ModelModal.style';
import { ModelModalProps } from './ModelModal.types';
import {
    CREATE_NEW_TAG_MESSAGE,
    MIN_LENGHT_INPUTING,
    TAG_NOT_FOUND_MESSAGE,
} from './ModelModal.constants';

const ModelModal: FunctionComponent<ModelModalProps> = (props: ModelModalProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false); // when this state is true - show preloader, in another cases - show modal window
    const [tagsIsLoading, setTagsIsLoading] = useState<boolean>(false); // when this state is true - show preloader, in another cases - show tags input field
    const [isNewTag, setIsNewTag] = useState<boolean>(false);
    const [error, setError] = useState<Nullable<string>>(null); // when error !== null - show error message. Value of this state will sets as null after each changing the inputting fields
    const [open, setOpen] = useState<boolean>(false);

    const { tags } = useTypedSelector((state) => state.tags);
    const { user } = useTypedSelector((state) => state.auth);
    const { getAllTags, addNewTag } = useTagActions();

    const [model, setModel] = useState<Model>({} as Model);
    const [inputTagsList, setInputTagsList] = useState<string[]>([]);
    const [inputTagName, setInputTagName] = useState<string>('');

    const file = React.createRef<HTMLInputElement>();
    const preview = React.createRef<HTMLInputElement>();

    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    useEffect(() => {
        if (!open) {
            return;
        }

        setIsNewTag(false);
        setTagsIsLoading(true);

        getAllTags((isDone, error) => {
            setTagsIsLoading(false);

            if (!isDone) {
                setError(error || UNKNOWN_EXCEPTION);
            }
        });
    }, [open]);

    useEffect(() => {
        const emptyModelEntity: Model = {
            // TODO: In onCloseHandel we can save values into sesionStorage and here get data from there
            name: '',
            description: '',
            tags: [],
            id: '',
            filekey: '',
            prevBlobKey: '',
            createdAt: new Date(),
            createdBy: '',
            updatedAt: new Date(),
            updatedBy: '',
            modelHistory: [],
        };
        const model = props.model || emptyModelEntity;

        setModel(model);

        if (model.tags) {
            setInputTagsList([...model.tags.map((tag) => tag.name)]);
        }
    }, [props.model]);

    useEffect(() => {
        setError(null);
    }, [open, model, file.current, preview.current]);

    useEffect(() => {
        if (inputTagName.trim().length < MIN_LENGHT_INPUTING) {
            setIsNewTag(false);
            return;
        }

        const tag = tags.find((tag) => tag.name === inputTagName);

        setIsNewTag(!tag);
    }, [inputTagName]);

    const onChangeNameHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
        setModel((currentValue) => ({
            ...currentValue,
            name: e.target?.value,
        }));

    const onChangeDescriptionHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
        setModel((currentValue) => ({
            ...currentValue,
            description: e.target?.value,
        }));

    const onChangeTagNameHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
        setInputTagName(e.target?.value);

    const onAddNewTagHandler = () => {
        setIsNewTag(false);
        setTagsIsLoading(true);

        addNewTag({ id: '', name: inputTagName }, (isDone, error) => {
            setTagsIsLoading(false);

            if (!isDone) {
                setError(error || UNKNOWN_EXCEPTION);
                return;
            }

            setInputTagsList((currentValue) => [...currentValue, inputTagName]);
        });
    };

    const validateInputFields = (): boolean => {
        if (model.name.trim().length < MIN_LENGHT_INPUTING) {
            setError(LENGTH_OF_NAME_EXCEPTION);
            return false;
        }

        if (model.description.trim().length < MIN_LENGHT_INPUTING) {
            setError(LENGTH_OF_DESCRIPTION_EXCEPTION);
            return false;
        }

        const fileExtension = file.current?.files?.item(0)?.name.split('.')[1];
        if (!fileExtension || !ModelsFileExtensions.includes(fileExtension)) {
            setError(FILE_NOT_CAD_EXCEPTION);
            return false;
        }

        if (preview.current?.files?.item(0)?.type.split('/')[0] !== 'image') {
            setError(FILE_NOT_IMAGE_EXCEPTION);
            return false;
        }

        return true;
    };

    const assignTagToModel = () => {
        const tagsList = inputTagsList.map((tagName) => {
            const index = tags.findIndex((tag) => tag.name === tagName);

            return tags[index];
        });

        return tagsList;
    };

    const onSendFormHandler = () => {
        if (!validateInputFields()) {
            return;
        }

        setIsLoading(true);

        const fileValue = file.current?.files?.item(0);
        const previewValue = preview.current?.files?.item(0);

        if (!fileValue) {
            setError(FILE_NOT_CAD_EXCEPTION);
            console.log(fileValue);
            return;
        }

        if (!previewValue) {
            setError(FILE_NOT_IMAGE_EXCEPTION);

            return;
        }

        const createdModel = { ...model, tags: assignTagToModel() };

        props.onSendFormHandler(
            createdModel,
            fileValue,
            previewValue,
            (isDone, error) => {
                setIsLoading(false);

                if (!isDone) {
                    setError(error || UNKNOWN_EXCEPTION);
                } else {
                    props.onCloseModalHandler();
                }
            },
        );
    };

    const preloaderNode: React.ReactNode = (
        <Box sx={preloaderStyles}>
            <CircularProgress />
        </Box>
    );

    const tagListMessage: React.ReactNode = (
        <>
            {isNewTag && (
                <Typography variant="h6" component="span" sx={{ fontSize: '15px' }}>
                    {user?.isAdmin ? CREATE_NEW_TAG_MESSAGE : TAG_NOT_FOUND_MESSAGE}
                    {user?.isAdmin && (
                        <IconButton
                            color="success"
                            component="label"
                            onClick={onAddNewTagHandler}
                        >
                            <DoneOutlineIcon />
                        </IconButton>
                    )}
                </Typography>
            )}
        </>
    );

    const tagsList: React.ReactNode = (
        <>
            {tagListMessage}
            <Autocomplete
                multiple
                id="tags-filled"
                options={tags.map((tag) => tag.name)}
                freeSolo
                renderTags={(value: readonly string[], getTagProps) =>
                    value.map((option: string, index: number) => (
                        <Chip
                            variant="outlined"
                            label={option}
                            {...getTagProps({ index })}
                            key={option}
                        />
                    ))
                }
                value={inputTagsList}
                onChange={(e, value) => setInputTagsList(value)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Tags"
                        placeholder="Enter"
                        value={inputTagName}
                        onChange={onChangeTagNameHandler}
                    />
                )}
                sx={inputFieldStyle}
            />
        </>
    );

    const windowContentNode: React.ReactNode = (
        <>
            <Stack sx={contentStyle} direction="column" alignItems="center" spacing={2}>
                <TextField
                    id="standard-basic"
                    className="text_field"
                    label="Model name"
                    variant="standard"
                    onChange={onChangeNameHandler}
                    value={model.name}
                    sx={inputFieldStyle}
                    margin="dense"
                />
                <TextField
                    id="standard-basic"
                    className="text_field"
                    label="Model description"
                    variant="standard"
                    onChange={onChangeDescriptionHandler}
                    value={model.description}
                    sx={inputFieldStyle}
                    margin="dense"
                />

                {tagsIsLoading ? preloaderNode : tagsList}

                <Button variant="contained" component="label" size="small">
                    Upload your photo
                    <input hidden accept="image/*" type="file" ref={preview} />
                </Button>

                <Button variant="contained" component="label" size="small">
                    Upload your CAD file
                    <input hidden accept=".cad" type="file" ref={file} />
                </Button>
            </Stack>
            <Stack
                display="flex"
                direction="row"
                justifyContent="flex-end"
                spacing={1}
                sx={{ width: '90%', m: 1 }}
            >
                <Button
                    variant="contained"
                    size="small"
                    onClick={props.onCloseModalHandler}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    color="success"
                    endIcon={<SendIcon />}
                    onClick={onSendFormHandler}
                >
                    {props.resultButtonsCaption}
                </Button>
            </Stack>
        </>
    );

    const modalWindowNode: React.ReactNode = (
        <Modal
            open={open}
            onClose={props.onCloseModalHandler}
            closeAfterTransition
            BackdropProps={{
                timeout: 1000,
            }}
        >
            <Box sx={modalWindowStyles}>
                {isLoading ? preloaderNode : windowContentNode}
            </Box>
        </Modal>
    );

    const statusNode: React.ReactNode = (
        <>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={error !== null}
                key={'top' + 'center'}
            >
                <Alert severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );

    return (
        <>
            {error && statusNode}
            {modalWindowNode}
        </>
    );
};

export default ModelModal;
