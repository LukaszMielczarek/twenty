/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect } from 'react';

import { useAttachments } from '@/activities/files/hooks/useAttachments';
import { currentQuotationsState } from '@/activities/quotation/states/currentQuotationsState';
import { Quotation } from '@/activities/types/Quotation';
import { useRecoilState } from 'recoil';
import { REACT_APP_SERVER_BASE_URL } from '~/config';
import { logError } from '~/utils/logError';
import { ActivityTargetableObject } from '../../types/ActivityTargetableEntity';

export const useQuotations = (targetableObject: ActivityTargetableObject) => {
  const downloadQuotation = async (name: string, fullPath: string) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await fetch(
        REACT_APP_SERVER_BASE_URL + '/files/' + fullPath,
      );
      if (response.status !== 200) {
        throw new Error('Failed fetching file:' + fullPath);
      }
      const quotation = (await response.json()) as Quotation;
      return { ...quotation, name };
    } catch (error) {
      throw error;
    }
  };

  const [currentQuotations, setCurrentQuotations] = useRecoilState(
    currentQuotationsState,
  );

  const { attachments, loading } = useAttachments(targetableObject);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        // Filter for .json attachments
        const jsonAttachments = attachments.filter(
          (attachment) =>
            attachment.name.includes('quotation') &&
            attachment.name.endsWith('.json'),
        );
        // Download all quotations in parallel
        const quotations = await Promise.all(
          jsonAttachments.map((attachment) =>
            downloadQuotation(attachment.name, attachment.fullPath),
          ),
        );
        // Once all quotations are fetched, set them
        setCurrentQuotations(quotations);
      } catch (error) {
        logError('Error fetching quotations: ' + error);
        throw error;
      }
    };

    if (attachments.length > 0) {
      fetchQuotations();
    } else {
      setCurrentQuotations([]);
    }
  }, [attachments, setCurrentQuotations]);

  return {
    quotations: currentQuotations as Quotation[],
    loading,
  };
};
