import {useEffect, useState} from "react"
import {getCategories, getManufacturers} from "@/activities/quotation/api/quotations";
import type {GridColDef} from "@mui/x-data-grid/models/colDef/gridColDef";
import {GridEditInputCell, GridPreProcessEditCellProps, GridRenderEditCellParams} from "@mui/x-data-grid";
import {styled, Tooltip, tooltipClasses, TooltipProps} from "@mui/material";
import {Item} from "@/activities/types/Quotation";


export const useColumns = (products: any) => {
    const [columns, setColumns] = useState<GridColDef[]>([]);
    const [manufacturers, setManufacturers] = useState([])
    const [categories, setCategories] = useState([])

    useEffect(() => {
        getManufacturers().then(value => {
            setManufacturers(value)
        });
        getCategories().then(value => {
            setCategories(value)
        });
    }, [])

    const getProductList = (manufacturerId: string, categoryId: string) => {
        if (products[manufacturerId] && products[manufacturerId][categoryId]) {
            return products[manufacturerId][categoryId]
        }
        return []
    }

    const StyledBox = styled('div')(({theme}) => ({
        height: 400,
        width: '100%',
        '& .MuiDataGrid-cell--editable': {
            backgroundColor: 'rgb(217 243 190)',
            '& .MuiInputBase-root': {
                height: '100%',
            },
            ...theme.applyStyles('dark', {
                backgroundColor: '#376331',
            }),
        },
        '& .Mui-error': {
            backgroundColor: 'rgb(126,10,15, 0.1)',
            color: '#750f0f',
            ...theme.applyStyles('dark', {
                backgroundColor: 'rgb(126,10,15, 0)',
                color: '#ff4343',
            }),
        },
    }));

    const validateQuantity = (row: Item, newValue: number) => {
        if (newValue <= 0) {
            return "You need to add at least 1";
        }
        return undefined;
    }

    const StyledTooltip = styled(({className, ...props}: TooltipProps) => (
        <Tooltip {...props} classes={{popper: className}}/>
    ))(({theme}) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
        },
    }));

    function StyledEditInputCell(props: GridRenderEditCellParams) {
        const {error} = props;
        return <StyledTooltip open={!!error} title={error}>
            <div>
                <GridEditInputCell {...props} />
            </div>
        </StyledTooltip>;
    }

    function renderEditInputCell(params: GridRenderEditCellParams) {
        return <StyledEditInputCell {...params} />;
    }

    useEffect(() => {
        if (manufacturers && manufacturers.length > 0 && categories && categories.length > 0) {
            setColumns([
                {
                    field: 'manufacturerId',
                    headerName: "MANUFACTURER",
                    editable: true,
                    type: 'singleSelect',
                    flex: 1,
                    getOptionValue: (value: any) => {
                        return value.id;
                    },
                    getOptionLabel: (value: any) => {
                        return value.name
                    },
                    valueOptions: manufacturers?.map((value: any) => {
                            return {
                                name: value.name,
                                id: value.id
                            }
                        }
                    ),
                },
                {
                    field: 'categoryId',
                    headerName: "CATEGORY",
                    editable: true,
                    flex: 1,
                    type: 'singleSelect',
                    getOptionValue: (value: any) => {
                        return value.id;
                    },
                    getOptionLabel: (value: any) => {
                        return value.name
                    },
                    valueOptions: categories?.map((value: any) => {
                            return {
                                name: value.name,
                                id: value.id
                            }
                        }
                    ),
                },
                {
                    field: 'productId',
                    headerName: "PRODUCT NAME",
                    editable: true,
                    flex: 1,
                    type: 'singleSelect',
                    getOptionValue: (value: any) => {
                        return value.id;
                    },
                    getOptionLabel: (value: any) => {
                        return value.name
                    },
                    valueOptions: ({row}: any) => {
                        return getProductList(row.manufacturerId, row.categoryId);
                    }
                },
                {
                    field: 'quantity',
                    headerName: "QUANTITY",
                    editable: true,
                    flex: 1,
                    type: 'number',
                    preProcessEditCellProps: async (params: GridPreProcessEditCellProps) => {
                        return {...params.props, error: validateQuantity(params.row, params.props.value)};
                    },
                    renderEditCell: renderEditInputCell,
                },
                {
                    field: 'unitPrice',
                    headerName: "UNIT PRICE",
                    editable: true,
                    flex: 1,
                },
                {
                    field: 'netPrice',
                    headerName: "NET PRICE",
                    editable: false,
                    flex: 1,
                },
                {
                    field: 'grossPrice',
                    headerName: "GROSS PRICE",
                    type: 'number',
                    editable: false,
                    flex: 1,
                },
                {
                    field: 'vatAmount',
                    headerName: "VAT AMOUNT",
                    editable: false,
                    flex: 1
                },

            ]);
        }
    }, [manufacturers, categories, products])

    return columns;
}