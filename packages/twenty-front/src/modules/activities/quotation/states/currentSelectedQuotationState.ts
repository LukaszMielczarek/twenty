import { Quotation } from '@/activities/types/Quotation';
import { atom } from 'recoil';

export const currentSelectedQuotationState = atom<Quotation | null>({
  default: null,
  key: 'currentSelectedQuotationState',
});
