import {atom} from 'recoil';

export const currentUsedTemplatesState = atom<String[]>({
    default: [],
    key: 'currentUsedTemplatesState',
});
