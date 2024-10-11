import { useState } from 'react';
import { getProducts } from '@/activities/template/api/templates';

export const useCachedProducts = () => {
  const [products, setProducts] = useState<any>({});

  const updateProducts = (manufacturerId: string, categoryId: string) => {
    if (
      !products ||
      !products[manufacturerId] ||
      !products[manufacturerId][categoryId]
    ) {
      getProducts(manufacturerId, categoryId).then((value: any) => {
        setProducts((oldValue: any) => {
          const newProducts = { ...oldValue };
          newProducts[manufacturerId] = oldValue[manufacturerId] || {};
          newProducts[manufacturerId][categoryId] = value;
          return newProducts;
        });
      });
    }
  };
  return [products, updateProducts];
};
