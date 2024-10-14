import {useEffect, useState} from 'react';
import {getCategories, getManufacturers,} from '@/activities/template/api/templates';
import {GridColDef} from '@mui/x-data-grid/models/colDef/gridColDef';
import {Divider, Stack} from '@mui/material';
import {Button} from '@/ui/input/button/components/Button';
import styled from '@emotion/styled';

const StyledTemplatesActions = styled.div`
    display: flex;
    justify-content: flex-start;
    alignment-baseline: center;
`;

export const useColumns = (products: any, handleDelete: any) => {
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
                    valueOptions: ({row}: any) => {
                        return getProducts(row.manufacturerId, row.categoryId);
                    }
                },
                {
                    field: 'action',
                    headerName: 'ACTIONS',
                    sortable: false,
                    flex: 0.5,
                    // disableClickEventBubbling: true,
                    renderCell: (params) => {
                        return (
                            <StyledTemplatesActions>
                                <Stack direction="row"
                                       divider={<Divider orientation="vertical" flexItem/>}
                                       spacing={2}>
                                    <Button title={'DELETE'} onClick={(e) => handleDelete(e, params)}/>
                                </Stack>
                            </StyledTemplatesActions>
                        );
                    },
                }
            ]);
        }
    }, [manufacturers, categories, products]);

    return columns;
};
