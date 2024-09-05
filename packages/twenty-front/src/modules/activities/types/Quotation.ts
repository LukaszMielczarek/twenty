import { UUID } from 'crypto';

export type Quotation = {
  id: UUID;
  name: string;
  type: 'Quotation';
  version: string;
  roofAnalysisInfo: RoofAnalysisInfo;
  customer: Customer;
  warehouse: Warehouse;
  manufacturers: Manufacturer[];
  totalSummary: Summary;
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

export type Manufacturer = {
  manufacturerId: UUID;
  manufacturerName: string;
  categories: Categories[];
  summary: Summary;
};

export type Categories = {
  categoryId: UUID;
  categoryName: string;
  products: Product[];
  summary: Summary;
};

export type Product = {
  productId: UUID;
  productName: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  netPrice: number;
  vatAmount: number;
  grossPrice: number;
};

export type Summary = {
  totalNetValue: 2000;
  totalVatValue: 460;
  totalGrossValue: 2460;
};
