import styled from '@emotion/styled';

import { Quotation } from '@/activities/types/Quotation';

import {
  generateColumns,
  generateRows,
} from '@/activities/quotation/utils/QuotationUtils';
import { Table } from '@/spreadsheet-import/components/Table';
import { useMemo } from 'react';

const StyledTable = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  display: flex;
  flex-direction: column;
  height: auto;
  justify-content: space-between;
  max-width: unset;
`;

const StyledTableDetails = styled.div`
  align-items: center;
  align-self: stretch;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(2)};
`;

const StyledTableContent = styled.div`
  align-self: stretch;
  color: ${({ theme }) => theme.font.color.secondary};
  line-break: anywhere;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-line;
`;

const StyledTableSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(2)};
  width: calc(100% - ${({ theme }) => theme.spacing(4)});
`;

const StyledTableSummaryHeader = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledTableSummaryTitle = styled.span`
  color: ${({ theme }) => theme.font.color.secondary};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
`;

const StyledTableSummaryContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledTableSummaryLabel = styled.span`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

export const QuotationTable = ({
  quotation,
}: {
  quotation: Quotation | null;
}) => {
  const data = useMemo(() => generateRows(quotation), [quotation]);
  const columns = useMemo(() => generateColumns(), []);

  return (
    <StyledTable>
      <StyledTableDetails>
        <StyledTableContent>
          <Table rows={data} columns={columns} className={'rdg-example'} />
        </StyledTableContent>
      </StyledTableDetails>
      <StyledTableSummary>
        <StyledTableSummaryHeader>
          <StyledTableSummaryTitle>TOTAL SUMMARY</StyledTableSummaryTitle>
        </StyledTableSummaryHeader>
        <StyledTableSummaryContent>
          <StyledTableSummaryLabel>{`Total Gross Value : ${quotation?.totalSummary.totalGrossValue}`}</StyledTableSummaryLabel>
          <StyledTableSummaryLabel>{`Total Net Value : ${quotation?.totalSummary.totalNetValue}`}</StyledTableSummaryLabel>
          <StyledTableSummaryLabel>{`Total VAT Value : ${quotation?.totalSummary.totalVatValue}`}</StyledTableSummaryLabel>
        </StyledTableSummaryContent>
      </StyledTableSummary>
    </StyledTable>
  );
};
