import { Card, Category } from '@beelzebub/shared/domain';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';

export const useCardImageUrl = (
  cardCategoryId: Category['id'],
  cardImgFileName: Card['imgFileName']
) => {
  const supabaseClient = useSupabaseClient();
  const [cardUrl, setCardUrl] = useState<string | undefined>();

  useEffect(() => {
    const downloadCardImage = async () => {
      const { data, error } = await supabaseClient.storage
        .from('app-static-resources')
        .download(`cards/images/${cardCategoryId}/${cardImgFileName}`);
      if (data == null) {
        return;
      }
      const url = URL.createObjectURL(data);
      setCardUrl(url);
    };
    downloadCardImage();
  }, [cardCategoryId, cardImgFileName, supabaseClient]);

  return cardUrl;
};
