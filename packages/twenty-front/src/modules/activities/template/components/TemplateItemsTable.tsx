import {DataGrid, GridPagination, GridRowSelectionModel} from '@mui/x-data-grid';
import {useCachedProducts} from '@/activities/template/hooks/useCachedProducts';
import {useRecoilState} from 'recoil';
import {currentSelectedTemplateState} from '../states/currentSelectedTemplateState';
import styled from '@emotion/styled';
import {Button} from '@/ui/input/button/components/Button';
import Grid from '@mui/material/Grid2';
import {useEffect, useState} from 'react';
import {TemplateItem} from '@/activities/types/Template';
import {ThemeProvider, useTheme} from '@emotion/react';
import {createTheme} from '@mui/material';
import {currentTemplatesState} from '../states/currentTemplatesState';
import {deleteTemplateItem} from '../api/templates';
import {useColumns} from '../hooks/useColumns';

const StyledTemplateItemsTable = styled.div`
    display: flex;
    flex-direction: column
`;

const StyledTemplateItemsTableHeader = styled.div``;

const StyledTemplateItemsTableContainer = styled.div`
    display: flex;
    flex-direction: column;
`;
const StyledTemplatesTableFooter = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 1rem;
`;

export const TemplateItemsTable = () => {
    const theme = useTheme();
    const MuiTheme = createTheme({
        palette: {
            mode: theme.name === 'light' ? 'light' : 'dark',
        },
    });

    const [currentTemplates, setCurrentTemplates] = useRecoilState(
        currentTemplatesState,
    );

    const [currentSelectedTemplate, setCurrentSelectedTemplate] = useRecoilState(
        currentSelectedTemplateState,
    );
    const [rows, setRows] = useState<TemplateItem[]>(
        currentSelectedTemplate?.templateItems || [],
    );
    const [cachedProducts, updateCachedProducts] = useCachedProducts();

    const handleDelete = (e: any, params: any) => {
        const currentRow = params.row;
        const item = currentSelectedTemplate?.templateItems?.find(item => item.id === currentRow.id)
        if (item) {
            deleteTemplateItem(item.id);
        }
        const newRows = rows.filter(value => value.id !== currentRow.id)
        setRows(newRows)
    }

    const addNewRow = () => {
        const tempItems: TemplateItem[] = [...rows];
        tempItems.push({
            id: self.crypto.randomUUID(),
        });
        setRows(tempItems);
        setCurrentSelectedTemplate({...currentSelectedTemplate, templateItems: tempItems});
    };

    const handleProcessRowUpdate = (
        updatedRow: TemplateItem,
        originalRow: TemplateItem,
    ) => {
        if (originalRow.manufacturerId !== updatedRow.manufacturerId) {
            updatedRow.categoryId = undefined;
            updatedRow.productId = undefined;
        } else if (originalRow.categoryId !== updatedRow.categoryId) {
            updatedRow.productId = undefined;
        }
        const index = rows.findIndex((row) => row.id === originalRow.id);
        const tempRows = [...rows];
        tempRows[index] = updatedRow;
        setRows(tempRows);
        setCurrentSelectedTemplate({...currentSelectedTemplate, templateItems: tempRows});
        return updatedRow;
    };

    const handleRowSelectionModelChange = (
        rowSelectionModel: GridRowSelectionModel,
    ) => {
    };

    const columns = useColumns(cachedProducts, handleDelete);

    useEffect(() => {
        setRows(currentSelectedTemplate?.templateItems || []);
        rows.forEach((row) => {
            if (row.manufacturerId && row.categoryId) {
                updateCachedProducts(row.manufacturerId, row.categoryId);
            }
        });
    }, [currentSelectedTemplate]);

    const Footer = (props: any) => {
        return (
            <Grid container>
                <StyledTemplatesTableFooter>
                    <Button
                        title="Add row"
                        onClick={() => {
                            addNewRow();
                        }}
                    ></Button>
                    <GridPagination {...props}/>
                </StyledTemplatesTableFooter>
            </Grid>
        );
    };

    return (
        <>
            <StyledTemplateItemsTable>
                <StyledTemplateItemsTableHeader>
                    <h3>Template Items</h3>
                </StyledTemplateItemsTableHeader>
                <ThemeProvider theme={MuiTheme}>
                    <StyledTemplateItemsTableContainer>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            checkboxSelection={true}
                            disableRowSelectionOnClick
                            autoHeight={true}
                            processRowUpdate={handleProcessRowUpdate}
                            onRowSelectionModelChange={handleRowSelectionModelChange}
                            onCellEditStop={(event) => {
                                if (event.row.manufacturerId && event.row.categoryId) {
                                    updateCachedProducts(
                                        event.row.manufacturerId,
                                        event.row.categoryId,
                                    );
                                }
                            }}
                            pagination
                            pageSizeOptions={[5, 10, 25]}
                            initialState={{
                                pagination: {paginationModel: {pageSize: 5}},
                            }}
                            slots={{
                                footer: Footer,
                            }}
                        />
                    </StyledTemplateItemsTableContainer>
                </ThemeProvider>
            </StyledTemplateItemsTable>
        </>
    );
};
