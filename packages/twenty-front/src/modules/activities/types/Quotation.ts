import {UUID} from 'crypto';

export type Quotation = {
  id: UUID;
  name: string;
  type: 'Quotation';
  version: string;
  roofAnalysisInfo: RoofAnalysisInfo;
  customer: Customer;
  warehouse: Warehouse;
  items: Item[];
};

export type RoofAnalysisInfo = {
  analysisId: UUID;
  analysisUri: string; // URI ?
};

export type Customer = {
  id: UUID;
  name: string;
  address: string;
  phone: string;
};

export type Warehouse = {
  id: UUID;
  name: string;
  address: string;
  phone: string;
};

export type Item = {
  id: string;
  manufacturerId?: string;
  categoryId?: string;
  productId?: string;
  productName?: string;
  quantity?: number;
  unitOfMeasure?: string;
  unitPrice?: number;
  netPrice?: number;
  vatAmount?: number;
  grossPrice?: number;
  vat?: number;
};
