import { Quotation } from '@/activities/types/Quotation';

const headerNames = new Map<string, string>([
  ['manufacturer', 'MANUFACTURER'],
  ['category', 'CATEGORY'],
  ['product_name', 'PRODUCT NAME'],
  ['quantity', 'QUANTITY'],
  ['unit_price', 'UNIT PRICE'],
  ['net_price', 'NET PRICE'],
  ['gross_price', 'GROSS PRICE'],
  ['vat_amount', 'VAT AMOUNT'],
]);

export const generateColumns = () =>
  [...headerNames].map(([key, value]) => ({
    key: key,
    name: value,
    // minWidth: 100,
  }));

export const generateRows = (quotation: Quotation | null) => {
  const rows: any[] = [];

  quotation?.manufacturers.map((manufacturer) =>
    manufacturer.categories.map((category) =>
      category.products.map((product) => {
        rows.push({
          manufacturer: manufacturer.manufacturerName,
          category: category.categoryName,
          product_name: product.productName,
          quantity: product.quantity,
          unit_price: product.unitPrice,
          net_price: product.netPrice,
          gross_price: product.grossPrice,
          vat_amount: product.vatAmount,
        });
      }),
    ),
  );
  return rows;
};
