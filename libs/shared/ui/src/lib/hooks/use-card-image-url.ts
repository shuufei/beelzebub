import { Card } from '@beelzebub/shared/domain';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';

export const useCardImageUrl = (card: Card) => {
  const supabaseClient = useSupabaseClient();
  const [cardUrl, setCardUrl] = useState<string | undefined>();

  useEffect(() => {
    const downloadCardImage = async () => {
      const { data, error } = await supabaseClient.storage
        .from('app-static-resources')
        .download(`cards/images/${card.categoryId}/${card.imgFileName}`);
      if (data == null) {
        return;
      }
      const url = URL.createObjectURL(data);
      setCardUrl(url);
    };
    downloadCardImage();
  }, [card.categoryId, card.imgFileName, supabaseClient]);

  return cardUrl;
};
