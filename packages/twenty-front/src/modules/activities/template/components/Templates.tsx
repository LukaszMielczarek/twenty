import {TemplateList} from '@/activities/template/components/TemplateList';
import {ActivityTargetableObject} from '@/activities/types/ActivityTargetableEntity';
import AnimatedPlaceholder from '@/ui/layout/animated-placeholder/components/AnimatedPlaceholder';
import {
    AnimatedPlaceholderEmptyContainer,
    AnimatedPlaceholderEmptySubTitle,
    AnimatedPlaceholderEmptyTextContainer,
    AnimatedPlaceholderEmptyTitle,
    EMPTY_PLACEHOLDER_TRANSITION_PROPS,
} from '@/ui/layout/animated-placeholder/components/EmptyPlaceholderStyled';
import styled from '@emotion/styled';
import {useEffect} from 'react';
import {getTemplatesForWarehouse} from '../api/templates';
import {useRecoilState} from 'recoil';
import {currentTemplatesState} from '../states/currentTemplatesState';
import { UUID } from 'crypto';

const StyledTemplatesContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
`;

export const Templates = ({
                              targetableObject,
                          }: {
    targetableObject: ActivityTargetableObject;
}) => {
    const [currentTemplates, setCurrentTemplates] = useRecoilState(
        currentTemplatesState,
    );

    // TO-DO: Get WarehouseID from CRM WORKSPACE
    const warehouseId: UUID = 'd69a63a5-7a9a-4154-8be0-51fd25100d6a';

    const isTemplatesEmpty = !currentTemplates || currentTemplates.length === 0;

    useEffect(() => {
        getTemplatesForWarehouse(warehouseId).then((value) => setCurrentTemplates(value));
    }, []);

    if (isTemplatesEmpty) {
        return (
            <AnimatedPlaceholderEmptyContainer
                {...EMPTY_PLACEHOLDER_TRANSITION_PROPS}
            >
                <AnimatedPlaceholder type="noRecord"/>
                <AnimatedPlaceholderEmptyTextContainer>
                    <AnimatedPlaceholderEmptyTitle>
                        No templates
                    </AnimatedPlaceholderEmptyTitle>
                    <AnimatedPlaceholderEmptySubTitle>
                        There are no associated templates with this offer.
                    </AnimatedPlaceholderEmptySubTitle>
                </AnimatedPlaceholderEmptyTextContainer>
            </AnimatedPlaceholderEmptyContainer>
        );
    }
    return (
        <StyledTemplatesContainer>
            <TemplateList warehouseId={warehouseId}/>
        </StyledTemplatesContainer>
    );
};
