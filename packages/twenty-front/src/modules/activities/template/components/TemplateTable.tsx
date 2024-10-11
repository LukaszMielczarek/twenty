import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useRecoilState } from 'recoil';
import { currentTemplatesState } from '../states/currentTemplatesState';
import { currentSelectedTemplateState } from '../states/currentSelectedTemplateState';
import styled from '@emotion/styled';
import { Button } from '@/ui/input/button/components/Button';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { Template } from '@/activities/types/Template';
import { ThemeProvider, useTheme } from '@emotion/react';
import { createTheme } from '@mui/material';
import { UUID } from 'crypto';

const StyledTemplateTable = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTemplateTableHeader = styled.div``;

const StyledTemplatesTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

export const TemplateTable = ({warehouseId}:{warehouseId: UUID}) => {
  const theme = useTheme();
  const MuiTheme = createTheme({
    palette: {
      mode: theme.name === 'light' ? 'light' : 'dark',
    },
  });

  const [templates, setTemplates] = useRecoilState(currentTemplatesState);
  const [selectedTemplate, setSelectedTemplate] = useRecoilState(
    currentSelectedTemplateState,
  );
  const [rows, setRows] = useState<Template[]>(templates);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      editable: false,
      type: 'string',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'NAME',
      editable: true,
      type: 'string',
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'DESCRIPTION',
      editable: true,
      type: 'string',
      flex: 1,
    },
    {
      field: 'validFrom',
      headerName: 'VALID FROM',
      editable: true,
      type: 'dateTime',
      flex: 1,
    },
    {
      field: 'validTo',
      headerName: 'VALID TO',
      editable: true,
      type: 'dateTime',
      flex: 1,
    },
  ];

  useEffect(() => {
    setRows(templates);
  }, []);

  const handleProcessRowUpdate = async (
    updatedRow: Template,
    originalRow: Template,
  ) => {
    let index = rows.findIndex((row) => row.id === originalRow.id);
    let tempRows = [...rows];
    tempRows[index] = updatedRow;
    setRows(tempRows);
    setSelectedTemplate(updatedRow);
    return updatedRow;
  };

  const handleRowSelectionModelChange = (
    rowSelectionModel: GridRowSelectionModel,
  ) => {
    if (rowSelectionModel.length > 0) {
      const selectedTemplate = rows.find(
        (template) => template.id === rowSelectionModel[0],
      );
      setSelectedTemplate(selectedTemplate ? { ...selectedTemplate } : null);
    } else {
      setSelectedTemplate(null);
    }
  };

  const handleCellEditStart = (
    params: any,
    event: { stopPropagation: () => void },
  ) => {
    event.stopPropagation(); // Prevent deselection during editing
  };

  const addNewRow = () => {
    let newRows = [...rows];
    const newRow = {
      id: self.crypto.randomUUID(),
      warehouseId: warehouseId,
      templateItems: [
        {
          id: self.crypto.randomUUID(),
        },
      ],
    };
    newRows.push(newRow);
    setRows(newRows);
    setSelectedTemplate(newRow);
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
      <StyledTemplateTable>
        <StyledTemplateTableHeader>
          <h3>Templates</h3>
        </StyledTemplateTableHeader>
        <ThemeProvider theme={MuiTheme}>
          <StyledTemplatesTableContainer>
            <DataGrid
              rows={rows}
              columns={columns}
              autoHeight={true}
              checkboxSelection={true}
              disableMultipleRowSelection
              disableRowSelectionOnClick
              onCellEditStart={handleCellEditStart}
              processRowUpdate={handleProcessRowUpdate}
              onRowSelectionModelChange={handleRowSelectionModelChange}
              slots={{
                footer: getFooter,
              }}
            />
          </StyledTemplatesTableContainer>
        </ThemeProvider>
      </StyledTemplateTable>
    </>
  );
};
