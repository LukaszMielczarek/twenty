import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import { useColumns } from '@/activities/template/hooks/useColumns';
import { useCachedProducts } from '@/activities/template/hooks/useCachedProducts';
import { useRecoilState } from 'recoil';
import { currentSelectedTemplateState } from '../states/currentSelectedTemplateState';
import styled from '@emotion/styled';
import { Button } from '@/ui/input/button/components/Button';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { TemplateItem } from '@/activities/types/Template';
import { ThemeProvider, useTheme } from '@emotion/react';
import { createTheme } from '@mui/material';

const StyledTemplateItemsTable = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTemplateItemsTableHeader = styled.div``;

const StyledTemplateItemsTableContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TemplateItemsTable = () => {
  const theme = useTheme();
  const MuiTheme = createTheme({
    palette: {
      mode: theme.name === 'light' ? 'light' : 'dark',
    },
  });

  const [currentSelectedTemplate, setCurrentSelectedTemplate] = useRecoilState(
    currentSelectedTemplateState,
  );
  const [rows, setRows] = useState<TemplateItem[]>(
      currentSelectedTemplate?.templateItems || [],
  );
  const [cachedProducts, updateCachedProducts] = useCachedProducts();
  const columns = useColumns(cachedProducts);

  useEffect(() => {
    setRows(currentSelectedTemplate?.templateItems || []);
    rows.forEach((row) => {
      if (row.manufacturerId && row.categoryId) {
        updateCachedProducts(row.manufacturerId, row.categoryId);
      }
    });
  }, [currentSelectedTemplate]);

  const handleRowSelectionModelChange = (
    rowSelectionModel: GridRowSelectionModel,
  ) => {};

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
    setCurrentSelectedTemplate({ ...currentSelectedTemplate, templateItems: tempRows });
    return updatedRow;
  };

  const addNewRow = () => {
    const tempItems: TemplateItem[] = [...rows];
    tempItems.push({
      id: self.crypto.randomUUID(),
    });
    setRows(tempItems);
      setCurrentSelectedTemplate({ ...currentSelectedTemplate, templateItems: tempItems });
  };

  const getFooter = () => {
    return (
      <div>
        <Grid container style={{ padding: '1rem' }}>
          <Button
            title="Add row"
            onClick={() => {
              addNewRow();
            }}
          ></Button>
        </Grid>
      </div>
    );
  };

  return (
    <>
      <StyledTemplateItemsTable>
        <StyledTemplateItemsTableHeader>
          <h3>Templates Items</h3>
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
              slots={{
                footer: getFooter,
              }}
            />
          </StyledTemplateItemsTableContainer>
        </ThemeProvider>
      </StyledTemplateItemsTable>
    </>
  );
};
