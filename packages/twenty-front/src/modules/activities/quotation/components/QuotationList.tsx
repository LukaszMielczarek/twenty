import styled from '@emotion/styled';

import { QuotationTable } from '@/activities/quotation/components/QuotationTable';
import { currentSelectedQuotationState } from '@/activities/quotation/states/currentSelectedQuotationState';
import { Quotation } from '@/activities/types/Quotation';
import { Select } from '@/ui/input/components/Select';
import { useRecoilState } from 'recoil';

type QuotationListProps = {
  title: string;
  quotations: Quotation[];
};

const StyledContainer = styled.div`
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
`;

const StyledTitleBar = styled.h3`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  margin-top: ${({ theme }) => theme.spacing(4)};
  width: 100%;
`;

const StyledTitle = styled.span`
  color: ${({ theme }) => theme.font.color.primary};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
`;

const StyledCount = styled.span`
  color: ${({ theme }) => theme.font.color.light};
  margin-left: ${({ theme }) => theme.spacing(2)};
`;

const StyledQuotationContainer = styled.div`
  width: 100%;
`;

export const QuotationList = ({ title, quotations }: QuotationListProps) => {
  const [currentSelectedQuotation, setCurrentSelectedQuotation] =
    useRecoilState(currentSelectedQuotationState);

  if (quotations.length === 1) {
    setCurrentSelectedQuotation(quotations[0]);
  }

  return (
    <>
      {quotations && quotations.length > 0 && (
        <StyledContainer>
          <StyledTitleBar>
            <StyledTitle>
              {title}
              <StyledCount>{quotations.length}</StyledCount>
            </StyledTitle>
            <StyledTitle>
              <Select
                dropdownId="quotation-picker"
                value={currentSelectedQuotation?.id}
                options={quotations.map((quotation) => ({
                  value: quotation.id,
                  label: quotation.name,
                }))}
                onChange={(event) => {
                  setCurrentSelectedQuotation(
                    quotations.find((quotation) => {
                      return quotation.id === event;
                    }) || null,
                  );
                }}
              />
            </StyledTitle>
          </StyledTitleBar>
          <StyledQuotationContainer>
            <QuotationTable
              key={currentSelectedQuotation?.id}
              quotation={currentSelectedQuotation}
            />
          </StyledQuotationContainer>
        </StyledContainer>
      )}
    </>
  );
};
