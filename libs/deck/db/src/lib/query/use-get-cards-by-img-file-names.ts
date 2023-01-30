import { CardDB, convertToCard } from '@beelzebub/shared/db';
import { Card } from '@beelzebub/shared/domain';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { z } from 'zod';
import useSWR from 'swr';

export const useGetCardsByImgFileNames = (
  imgFileNames?: Card['imgFileName'][]
) => {
  const supabaseClient = useSupabaseClient();
  return useSWR(
    imgFileNames &&
      `/supabase/database/cards?imgFileNames=${imgFileNames.join(',')}`,
    async () => {
      const res = await supabaseClient
        .from('cards')
        .select()
        .in('img_file_name', imgFileNames ?? []);
      if (res.error != null) {
        console.error('failed get cards: ', res.error);
        return [];
      }
      const parsedCardDBList = z.array(CardDB).parse(res.data);
      const cards = parsedCardDBList.map((cardDB) => {
        return convertToCard(cardDB);
      });
      return cards;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  );
};
