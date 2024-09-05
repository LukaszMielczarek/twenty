import { Quotation } from '@/activities/types/Quotation';
import { atom } from 'recoil';

export const currentQuotationsState = atom<Quotation[]>({
  default: [],
  key: 'currentQuotationsState',
});
