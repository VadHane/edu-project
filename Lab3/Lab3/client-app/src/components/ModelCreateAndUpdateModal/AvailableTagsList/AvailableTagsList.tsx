import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { Tag } from '../../../models/Tag';
import { AvailableTagsListProps } from './AvailableTagsList.types';
import { useTagActions } from '../../../hooks/useTagActions';
import {
    ADD_TAG_MESSAGE,
    GET_CREATE_TAG_MESSAGE,
    LIST_INCLUDES_TAG_MESSAGE,
    MAX_LENGTH_INPUT_BOX,
} from './AvailableTagsList.constants';
import { APPROVE_IMAGE, CANCEL_IMAGE } from '../../../App.constants';
import './AvailableTagsList.css';

const AvailableTagsList: FunctionComponent<AvailableTagsListProps> = (
    props: AvailableTagsListProps,
) => {
    const [assignedTags, setAssignetTags] = useState<Array<Tag>>(props.tags);

    const [inputNameOfTag, setInputNameOfTag] = useState<string>('');
    const [isTagNew, setItNewTag] = useState<boolean>(false);
    const [isTagAdded, setItAddedTag] = useState<boolean>(false);

    const { tags } = useTypedSelector((state) => state.tags);
    const { addNewTag } = useTagActions();

    useEffect(() => {
        setAssignetTags(props.tags);
    }, [props.tags]);

    useEffect(() => {
        const isAvailable: boolean =
            !tags.find((tag: Tag) => tag.name === inputNameOfTag) &&
            inputNameOfTag.length > 1;

        const isAdded: boolean = assignedTags.find(
            (tag: Tag) => tag.name === inputNameOfTag,
        )
            ? true
            : false;

        setItNewTag(isAvailable);
        setItAddedTag(isAdded);
    }, [inputNameOfTag, assignedTags, tags]);

    const getAvailableToAssignTags = () => {
        return tags.filter((tag) => !assignedTags.includes(tag));
    };

    const getTagByName = (tagName: string): Tag => {
        const index = tags.findIndex((tag: Tag) => tag.name === tagName);
        return tags[index];
    };

    const inputBoxNode: React.ReactNode = (
        <>
            <datalist id="available-tags-list">
                {getAvailableToAssignTags()?.map((tag: Tag) => (
                    <option value={tag.name} key={tag.id}></option>
                ))}
            </datalist>
            <input
                type="text"
                list="available-tags-list"
                id="available-tags-list-input"
                value={inputNameOfTag}
                maxLength={MAX_LENGTH_INPUT_BOX}
                onChange={(e) => setInputNameOfTag(e.target.value)}
            />
        </>
    );

    const approveCreateNewTagNode: React.ReactNode = (
        <div className="aprove-add-tag">
            <span>{GET_CREATE_TAG_MESSAGE}</span> <br />
            <img
                src={APPROVE_IMAGE.URL}
                alt={APPROVE_IMAGE.ALT}
                onClick={() => {
                    addNewTag({ id: '', name: inputNameOfTag });
                    setItNewTag(false);
                }}
            />
            <img
                src={CANCEL_IMAGE.URL}
                alt={CANCEL_IMAGE.ALT}
                onClick={() => setInputNameOfTag('')}
            />
        </div>
    );

    const approveAssigningAvailableTagNode: React.ReactNode = (
        <div className="aprove-add-role">
            <span>{ADD_TAG_MESSAGE}</span> <br />
            <img
                src={APPROVE_IMAGE.URL}
                alt={APPROVE_IMAGE.ALT}
                onClick={() => {
                    props.assignedTag(getTagByName(inputNameOfTag));
                    setInputNameOfTag('');
                }}
            />
            <img
                src={CANCEL_IMAGE.URL}
                alt={CANCEL_IMAGE.ALT}
                onClick={() => setInputNameOfTag('')}
            />
        </div>
    );

    const approveAssigningTagNode: React.ReactNode = (
        <>{!isTagNew ? approveAssigningAvailableTagNode : approveCreateNewTagNode}</>
    );

    const tagWasAddedNode: React.ReactNode = (
        <div>
            <span>{LIST_INCLUDES_TAG_MESSAGE}</span> <br />
            <img
                src={APPROVE_IMAGE.URL}
                alt={APPROVE_IMAGE.ALT}
                onClick={() => setInputNameOfTag('')}
            />
        </div>
    );

    const messageAboutApproveTagNode: React.ReactNode = (
        <>{inputNameOfTag.trim().length > 1 ? approveAssigningTagNode : ''}</>
    );

    const messageAboutInputingTagNode: React.ReactNode = (
        <>{isTagAdded ? tagWasAddedNode : messageAboutApproveTagNode}</>
    );

    return (
        <>
            {inputBoxNode}
            {messageAboutInputingTagNode}
        </>
    );
};

export default AvailableTagsList;
