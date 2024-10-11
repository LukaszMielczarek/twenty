import { Template } from '@/activities/types/Template';
import { atom } from 'recoil';

export const currentSelectedTemplateState = atom<Template | null>({
  default: null,
  key: 'currentSelectedTemplateState',
});
