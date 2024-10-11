import { useEffect, useState } from 'react';
import {
  getCategories,
  getManufacturers,
} from '@/activities/template/api/templates';
import { GridColDef } from '@mui/x-data-grid/models/colDef/gridColDef';

export const useColumns = (products: any) => {
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getManufacturers().then((value) => {
      setManufacturers(value);
    });
    getCategories().then((value) => {
      setCategories(value);
    });
  }, []);

  const getProducts = (manufacturerId: string, categoryId: string) => {
    if (products[manufacturerId] && products[manufacturerId][categoryId]) {
      return products[manufacturerId][categoryId];
    }
    return [];
  };

  useEffect(() => {
    if (
      manufacturers &&
      manufacturers.length > 0 &&
      categories &&
      categories.length > 0
    ) {
      setColumns([
        {
          field: 'id',
          headerName: 'ID',
          type: 'string',
          editable: false,
          flex: 1,
        },
        {
          field: 'manufacturerId',
          headerName: 'MANUFACTURER',
          type: 'singleSelect',
          editable: true,
          flex: 1,
          getOptionValue: (value: any) => {
            return value.id;
          },
          getOptionLabel: (value: any) => {
            return value.name;
          },
          valueOptions: manufacturers?.map((value: any) => {
            return {
              name: value.name,
              id: value.id,
            };
          }),
        },
        {
          field: 'categoryId',
          headerName: 'CATEGORY',
          type: 'singleSelect',
          editable: true,
          flex: 1,
          getOptionValue: (value: any) => {
            return value.id;
          },
          getOptionLabel: (value: any) => {
            return value.name;
          },
          valueOptions: categories?.map((value: any) => {
            return {
              name: value.name,
              id: value.id,
            };
          }),
        },
        {
          field: 'productId',
          headerName: 'PRODUCT',
          type: 'singleSelect',
          editable: true,
          flex: 1,
          getOptionValue: (value: any) => {
            return value.id;
          },
          getOptionLabel: (value: any) => {
            return value.name;
          },
          valueOptions: ({ row }: any) => {
            return getProducts(row.manufacturerId, row.categoryId);
          },
        },
      ]);
    }
  }, [manufacturers, categories, products]);

  return columns;
};
