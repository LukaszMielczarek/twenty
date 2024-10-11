import { TemplateTable } from './TemplateTable';
import { useRecoilState } from 'recoil';
import { currentSelectedTemplateState } from '../states/currentSelectedTemplateState';
import { TemplateItemsTable } from './TemplateItemsTable';
import styled from '@emotion/styled';
import { Button } from '@/ui/input/button/components/Button';
import { Template } from '@/activities/types/Template';
import { currentTemplatesState } from '../states/currentTemplatesState';
import { upsertTemplate } from '../api/templates';
import { UUID } from 'crypto';

const StyledTemplatesList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  row-gap: 1rem;
`;

const StyledTemplatesListContainer = styled.div``;

const StyledTemplatesListFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const StyledUpdateTemplateButton = styled.button``;

export const TemplateList = ({warehouseId}:{warehouseId: UUID}) => {
  const [currentSelectedTemplate, setCurrentSelectedTemplate] = useRecoilState(
    currentSelectedTemplateState,
  );
  const [currentTemplates, setCurrentTemplates] = useRecoilState(
    currentTemplatesState,
  );

  const handleUpsert = (
    selectedTemplate: Template | null,
    templates: Template[],
  ) => {
    upsertTemplate(selectedTemplate, templates);
  };

  return (
    <>
      <StyledTemplatesList>
        <StyledTemplatesListContainer>
          <TemplateTable warehouseId={warehouseId}/>
          {currentSelectedTemplate && <TemplateItemsTable />}
        </StyledTemplatesListContainer>
        <StyledTemplatesListFooter>
          <Button
            title="Save Template"
            disabled={!currentSelectedTemplate}
            onClick={() => handleUpsert(currentSelectedTemplate, currentTemplates)}
          />
        </StyledTemplatesListFooter>
      </StyledTemplatesList>
    </>
  );
};
