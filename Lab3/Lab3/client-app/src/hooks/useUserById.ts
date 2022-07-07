import { User } from '../models/User';
import { Maybe } from '../types/App.types';
import { useTypedSelector } from './useTypedSelector';

export const useUserById = (id: Maybe<string>): User => {
    const { users } = useTypedSelector((state) => state.user);

    const emptyUser: User = {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        imageBlobKey: null,
        roles: [],
    };

    if (!id) {
        return emptyUser;
    }

    const foundUser = users.find((user) => user.id === id);

    if (!foundUser) {
        throw new Error();
    }

    return foundUser;
};
