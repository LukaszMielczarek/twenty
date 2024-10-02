import {
  DataGrid, GridCellModes,
  GridCellModesModel,
  GridCellParams
} from '@mui/x-data-grid';

import {Item, Quotation} from '@/activities/types/Quotation';
import {Button} from '@/ui/input/button/components/Button';
import {useCallback, useEffect, useState} from 'react';
import createTheme, {Theme} from '@mui/material/styles/createTheme';
import {ThemeProvider, darken, lighten} from '@mui/material';
import {useColumns} from "@/activities/quotation/hooks/useColumns";
import {useCachedProductList} from "@/activities/quotation/hooks/useCachedProductList";
import Grid from "@mui/material/Grid2";
import {useTheme} from "@emotion/react";
import {useRecalculate} from "@/activities/quotation/hooks/useRecalculate";

export const QuotationTable = ({
                                 quotation,
                               }: {
  quotation: Quotation | null;
}) => {
  const [data, setData] = useState<Item[]>(quotation?.items || []);
  const [changedRows, setChangedRows] = useState<string[]>([]);
  const [touched, setTouched] = useState<boolean>();
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({});

  const [products, updateList] = useCachedProductList();
  const columns = useColumns(products);
  const theme = useTheme();

  const recalculate = useRecalculate(quotation!.id);

  const MuiTheme = createTheme({
    palette: {
      mode: theme.name === 'light' ? 'light' : 'dark',
    }
  });

  const getBackgroundColor = (color: string, theme: Theme, coefficient: number) => ({
    backgroundColor: darken(color, coefficient),
    ...theme.applyStyles('light', {
      backgroundColor: lighten(color, coefficient),
    }),
  });


  const handleCellClick = useCallback(
      (params: GridCellParams, event: React.MouseEvent) => {
        if (!params.isEditable) {
          return;
        }

        // Ignore portal
        if (
            (event.target as any).nodeType === 1 &&
            !event.currentTarget.contains(event.target as Element)
        ) {
          return;
        }

        setCellModesModel((prevModel) => {
          return {
            // Revert the mode of the other cells from other rows
            ...Object.keys(prevModel).reduce(
                (acc, id) => ({
                  ...acc,
                  [id]: Object.keys(prevModel[id]).reduce(
                      (acc2, field) => ({
                        ...acc2,
                        [field]: {mode: GridCellModes.View},
                      }),
                      {},
                  ),
                }),
                {},
            ),
            [params.id]: {
              // Revert the mode of other cells in the same row
              ...Object.keys(prevModel[params.id] || {}).reduce(
                  (acc, field) => ({...acc, [field]: {mode: GridCellModes.View}}),
                  {},
              ),
              [params.field]: {mode: GridCellModes.Edit},
            },
          };
        });
      },
      [],
  );

  const handleCellModesModelChange = useCallback(
      (newModel: GridCellModesModel) => {
        setCellModesModel(newModel);
      },
      [],
  );

  useEffect(() => {
    let newChangedRows: string[] = [];
    data.forEach(row => {
      const originalRow = quotation?.items.find(item => item.id === row.id);
      if (originalRow === undefined || (originalRow && JSON.stringify(originalRow) !== JSON.stringify(row))) {
        newChangedRows.push(row.id)
      }
      if (row.manufacturerId && row.categoryId) {
        updateList(row.manufacturerId, row.categoryId);
      }
    })
    setChangedRows(newChangedRows)
  }, [data])

  const processChanges = async (prevRow: Item, newRow: Item) => {
    if (prevRow.manufacturerId !== newRow.manufacturerId) {
      newRow.categoryId = "";
      newRow.productId = "";
      newRow.netPrice = 0;
      newRow.grossPrice = 0;
      newRow.unitPrice = 0;
      newRow.vatAmount = 0;
    } else if (prevRow.categoryId !== newRow.categoryId) {
      newRow.productId = "";
      newRow.netPrice = 0;
      newRow.grossPrice = 0;
      newRow.unitPrice = 0;
      newRow.vatAmount = 0;
    } else if(prevRow.productId !== newRow.productId){
      var response = await recalculate(newRow);
      newRow = response.data
    } else if ((prevRow.unitPrice !== newRow.unitPrice || prevRow.quantity !== newRow.quantity) && newRow.unitPrice && newRow.quantity) {
      newRow.netPrice = newRow.unitPrice * newRow.quantity;
    }
    return newRow;
  }

  const addNewRow = () => {
    let newData = [...data];
    newData.push({
      id: self.crypto.randomUUID()
    })
    setData(newData);
  }

  const getFooter = () => {
    return <div>
      <Grid container spacing={4} style={{padding: "1rem"}}>
        <Grid size={4}>
          <Button title="Add row" onClick={() => {
            addNewRow()
          }}></Button>
        </Grid>
        <Grid size={4}>
        </Grid>
      </Grid>
    </div>
  }

  const getRowStyle = (row: any) => {
    if (changedRows.find(id => id == row.id)) {
      return 'modified'
    }
    return ''
  }

  return <>
    <div style={{
      marginBottom: "1rem"
    }}>
      <ThemeProvider theme={MuiTheme}>
        <DataGrid rows={data}
                  slots={{
                    footer: getFooter,
                  }}
                  getRowClassName={(params) => {
                    return getRowStyle(params.row)
                  }}
                  cellModesModel={cellModesModel}
                  onCellModesModelChange={handleCellModesModelChange}
                  onCellClick={handleCellClick}
                  onCellEditStop={(event) => {
                    if (event.row.manufacturerId && event.row.categoryId) {
                      updateList(event.row.manufacturerId, event.row.categoryId);
                    }
                  }}
                  onProcessRowUpdateError={(error) => {
                    console.log(error);
                  }}
                  processRowUpdate={async (newRow, prevRow) => {
                    let index = data.findIndex(row => row.id === prevRow.id);
                    let newData = [...data];
                    newData[index] = await processChanges(prevRow, newRow);
                    console.log(newData);
                    setData(newData);
                    setTouched(true);
                    return newRow;
                  }}
                  sx={(theme) => ({
                    '& .modified': {
                      ...getBackgroundColor(theme.palette.info.main, theme, 0.7),
                      '&:hover': {
                        ...getBackgroundColor(theme.palette.info.main, theme, 0.6),
                      },
                      '&.Mui-selected': {
                        ...getBackgroundColor(theme.palette.info.main, theme, 0.5),
                        '&:hover': {
                          ...getBackgroundColor(theme.palette.info.main, theme, 0.4),
                        },
                      },
                    },
                    '& .new': {
                      ...getBackgroundColor(theme.palette.success.main, theme, 0.7),
                      '&:hover': {
                        ...getBackgroundColor(theme.palette.success.main, theme, 0.6),
                      },
                      '&.Mui-selected': {
                        ...getBackgroundColor(theme.palette.success.main, theme, 0.5),
                        '&:hover': {
                          ...getBackgroundColor(theme.palette.success.main, theme, 0.4),
                        },
                      },
                    }
                  })}
                  columns={columns}/>
      </ThemeProvider>
    </div>

    {touched && <div style={{
      display: 'flex',
      gap: '1rem'
    }}><Button title="Update calculation"></Button>
      <Button title={"Reset calculation"} onClick={() => {
        setData(quotation!.items)
      }}></Button></div>}
  </>;
};
