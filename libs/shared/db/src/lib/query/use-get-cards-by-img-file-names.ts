import { Card } from '@beelzebub/shared/domain';
import {
  SupabaseClient,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { z } from 'zod';
import useSWR from 'swr';
import { CardDB, convertToCard } from '../cards';

export const getCardsByImgFileNamesFetcher = async ([
  ,
  imgFileNames,
  supabaseClient,
]: [string, string[], SupabaseClient]) => {
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
};

export const useGetCardsByImgFileNames = (
  imgFileNames?: Card['imgFileName'][]
) => {
  const supabaseClient = useSupabaseClient();
  return useSWR(
    imgFileNames && [
      `/supabase/database/cards?imgFileNames=${imgFileNames.join(',')}`,
      imgFileNames,
      supabaseClient,
    ],
    getCardsByImgFileNamesFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  );
};
