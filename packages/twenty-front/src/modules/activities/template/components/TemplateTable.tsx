import {DataGrid, GridColDef, GridPagination, GridRenderCellParams, GridRowSelectionModel} from '@mui/x-data-grid';
import {useRecoilState} from 'recoil';
import {currentTemplatesState} from '../states/currentTemplatesState';
import {currentSelectedTemplateState} from '../states/currentSelectedTemplateState';
import styled from '@emotion/styled';
import {Button} from '@/ui/input/button/components/Button';
import Grid from '@mui/material/Grid2';
import {useEffect, useState} from 'react';
import {Template, TemplateProps} from '@/activities/types/Template';
import {ThemeProvider, useTheme} from '@emotion/react';
import {createTheme, Divider, Stack} from '@mui/material';
import {deleteTemplate} from '../api/templates';
import {useUpdateOneRecord} from '@/object-record/hooks/useUpdateOneRecord';
import {CustomObjectNameSingular} from '@/object-metadata/types/CustomObjectNameSingular';
import { v4 as uuidv4 } from 'uuid';

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

const StyledTemplatesTableFooter = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 1rem;
`;

export const TemplateTable = ({warehouseId, offerId}: TemplateProps) => {
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

    const {updateOneRecord: updateOneActivity} = useUpdateOneRecord<any>({
        objectNameSingular: CustomObjectNameSingular.Offer,
    });

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
            setSelectedTemplate(selectedTemplate ? {...selectedTemplate} : null);
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
            id: uuidv4(),
            warehouseId: warehouseId,
            templateItems: [
                {
                    id: uuidv4(),
                },
            ],
        };
        newRows.push(newRow);
        setRows(newRows);
        setSelectedTemplate(newRow);
    };

    const handleUse = async (e: any, params: GridRenderCellParams) => {
        const currentRow = params.row;
        return await updateOneActivity?.({
            idToUpdate: offerId,
            updateOneRecordInput: {
                templateId: currentRow.id
            },
        }).then(() => console.log(`Succesfuly set TemplateId: ${currentRow.id} on Offer: ${offerId}`));
    }

    const handleDelete = (e: any, params: GridRenderCellParams) => {
        const currentRow = params.row;
        const template = templates.find(template => template.id === currentRow.id)
        if (template) {
            deleteTemplate(template.id);
        }
        const newRows = rows.filter(value => value.id !== currentRow.id)
        setRows(newRows)
    }

    const columns: GridColDef[] = [
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
        {
            field: 'action',
            headerName: 'ACTIONS',
            sortable: false,
            flex: 0.5,
            // disableClickEventBubbling: true,
            renderCell: (params: any) => {
                return (
                    <Stack direction="row"
                           divider={<Divider orientation="vertical" flexItem/>}
                           spacing={2} sx={{height: '100%', width: '100%'}}>
                        <Button title={'USE'} onClick={(e) => handleUse(e, params)}/>
                        <Button title={'DELETE'} onClick={(e) => handleDelete(e, params)}/>
                    </Stack>
                );
            },
        }
    ]

    useEffect(() => {
        setRows(templates);
    }, []);

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
                            pagination
                            pageSizeOptions={[5, 10, 25]}
                            initialState={{
                                pagination: {paginationModel: {pageSize: 5}},
                            }}
                            slots={{
                                footer: Footer,
                            }}
                        />
                        {/*<Footer/>*/}
                    </StyledTemplatesTableContainer>
                </ThemeProvider>
            </StyledTemplateTable>
        </>
    );
};
