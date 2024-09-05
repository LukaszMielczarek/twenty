import { SkeletonLoader } from '@/activities/components/SkeletonLoader';
import { QuotationList } from '@/activities/quotation/components/QuotationList';
import { useQuotations } from '@/activities/quotation/hooks/useQuotations';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import AnimatedPlaceholder from '@/ui/layout/animated-placeholder/components/AnimatedPlaceholder';
import {
  AnimatedPlaceholderEmptyContainer,
  AnimatedPlaceholderEmptySubTitle,
  AnimatedPlaceholderEmptyTextContainer,
  AnimatedPlaceholderEmptyTitle,
  EMPTY_PLACEHOLDER_TRANSITION_PROPS,
} from '@/ui/layout/animated-placeholder/components/EmptyPlaceholderStyled';
import styled from '@emotion/styled';

const StyledQuotationsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  overflow: auto;
`;

export const Quotations = ({
  targetableObject,
}: {
  targetableObject: ActivityTargetableObject;
}) => {
  const { quotations, loading } = useQuotations(targetableObject);

  const isQuotationsEmpty = !quotations || quotations.length === 0;

  if (loading && isQuotationsEmpty) {
    return <SkeletonLoader />;
  }

  if (isQuotationsEmpty) {
    return (
      <AnimatedPlaceholderEmptyContainer
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...EMPTY_PLACEHOLDER_TRANSITION_PROPS}
      >
        <AnimatedPlaceholder type="noRecord" />
        <AnimatedPlaceholderEmptyTextContainer>
          <AnimatedPlaceholderEmptyTitle>
            No quotations
          </AnimatedPlaceholderEmptyTitle>
          <AnimatedPlaceholderEmptySubTitle>
            There are no associated quotations with this offer.
          </AnimatedPlaceholderEmptySubTitle>
        </AnimatedPlaceholderEmptyTextContainer>
      </AnimatedPlaceholderEmptyContainer>
    );
  }

  return (
    <StyledQuotationsContainer>
      <QuotationList title="Quotations" quotations={quotations} />
    </StyledQuotationsContainer>
  );
};
