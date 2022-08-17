import React, { FunctionComponent, useEffect, useState } from 'react';
import ModelsBrowser from '../../components/ModelsBrowser/ModelsBrowser';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useModelActions } from '../../hooks/useModelActions';
import { UNKNOWN_EXCEPTION } from '../../exceptions';
import {
    Snackbar,
    Alert,
    Typography,
    Grid,
    Divider,
    IconButton,
    InputBase,
    Paper,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Chip,
    CircularProgress,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTagActions } from '../../hooks/useTagActions';
import { Model } from '../../models/Model';

const ModelsBrowserPage: FunctionComponent = () => {
    const { models } = useTypedSelector((state) => state.model);
    const { getAllModels } = useModelActions();

    const { tags } = useTypedSelector((state) => state.tags);
    const { getAllTags } = useTagActions();

    const [searchString, setSearchString] = useState<string>('');

    const [tagsIsLoading, setTagsIsLoading] = useState<boolean>(true);
    const [tagsModalIsOpen, setTagsModalIsOpen] = useState<boolean>(false);
    const [selectedTags, setSelectedTags] = useState<Array<string>>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    const [selectedModels, setSelectedModels] = useState<Array<Model>>([]);

    useEffect(() => {
        setIsLoading(true);

        getAllModels((isDone, error) => {
            setIsLoading(false);

            if (!isDone) {
                setError(error || UNKNOWN_EXCEPTION);
                return;
            }

            setSelectedModels(models);
        });
    }, []);

    useEffect(() => {
        if (!tagsModalIsOpen) {
            return;
        }

        setTagsIsLoading(true);

        getAllTags((isDone, error) => {
            setTagsIsLoading(false);

            if (!isDone) {
                setError(error || UNKNOWN_EXCEPTION);
            }
        });
    }, [tagsModalIsOpen]);

    useEffect(() => {
        filterModels();
    }, [selectedTags]);

    const onCloseSnackbarHandler = () => {
        setError(undefined);
    };

    const onChangeTagsList = (event: SelectChangeEvent<typeof selectedTags>) => {
        const {
            target: { value },
        } = event;

        const newValue = typeof value === 'string' ? value.split(',') : value;

        setSelectedTags(newValue);
    };

    const onRemoveTag = (tagName: string) => () => {
        setSelectedTags((current) => {
            return current.filter((_tagName) => _tagName !== tagName);
        });
    };

    const onClearSearchField = () => {
        setSearchString('');
        filterModels('');
    };

    const filterModels = (_searchString = searchString) => {
        const newModelList = models.filter((model) => {
            if (!model.name.toLowerCase().includes(_searchString.toLowerCase())) {
                return false;
            }

            let modelConsistAllTags = true;

            selectedTags.forEach((tagsName) => {
                const toLowerTagsName = tagsName.toLowerCase();

                const foundTag = model.tags.find(
                    (tag) => tag.name.toLowerCase() === toLowerTagsName,
                );

                if (!foundTag) {
                    modelConsistAllTags = false;
                    return;
                }
            });

            return modelConsistAllTags;
        });

        setSelectedModels(newModelList);
    };

    const searchingBox: React.ReactNode = (
        <Grid container spacing={2} sx={{ margin: '30px 30px -20px 30px' }}>
            <Grid item xs={8}>
                <Typography sx={{ padding: '15px', fontSize: '20px' }}>
                    Selected tags:{' '}
                    {selectedTags.map((tagName) => (
                        <Chip
                            key={tagName}
                            label={tagName}
                            onDelete={onRemoveTag(tagName)}
                            deleteIcon={<DeleteIcon />}
                            variant="outlined"
                        />
                    ))}
                    <IconButton onClick={() => setTagsModalIsOpen(true)}>
                        <AddCircleIcon fontSize="small" />
                    </IconButton>
                </Typography>
            </Grid>

            <Grid item xs={3}>
                <Paper
                    component="form"
                    sx={{
                        p: '2px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        width: 400,
                    }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search.."
                        value={searchString}
                        onChange={(e) => setSearchString(e.target.value)}
                    />

                    {searchString !== '' && (
                        <IconButton onClick={onClearSearchField}>
                            <CancelIcon />
                        </IconButton>
                    )}

                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

                    <IconButton onClick={() => filterModels()}>
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </Grid>
        </Grid>
    );

    const tagsModal: React.ReactNode = (
        <Dialog disableEscapeKeyDown open={tagsModalIsOpen}>
            <DialogTitle>Select some tags: </DialogTitle>
            {tagsIsLoading ? (
                <Box sx={{ display: 'block', m: '0 auto' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <DialogContent>
                    <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="tag-select-label">Tags</InputLabel>

                            <Select
                                labelId="tag-select-label"
                                multiple
                                value={selectedTags}
                                onChange={onChangeTagsList}
                                input={<OutlinedInput label="Tag" />}
                            >
                                {tags.map((tag) => (
                                    <MenuItem key={tag.id} value={tag.name}>
                                        {tag.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
            )}
            <DialogActions>
                <Button onClick={() => setTagsModalIsOpen(false)}>Ok</Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <>
            {searchingBox}
            <ModelsBrowser models={selectedModels} isLoading={isLoading} />
            <Snackbar
                open={error !== undefined}
                autoHideDuration={6000}
                onClose={onCloseSnackbarHandler}
            >
                <Alert severity="error">{error}</Alert>
            </Snackbar>

            {tagsModal}
        </>
    );
};

export default ModelsBrowserPage;
