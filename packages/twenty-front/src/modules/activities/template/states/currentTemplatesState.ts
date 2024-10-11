import { Template } from '@/activities/types/Template';
import { atom } from 'recoil';

export const currentTemplatesState = atom<Template[]>({
  default: [],
  key: 'currentTemplatesState',
});
