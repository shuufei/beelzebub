import { Card, CARD_HEIGHT, CARD_WIDTH } from '@beelzebub/shared/domain';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';

export const CardImg: FC<{ card: Card; width: number }> = ({ card, width }) => {
  const supabaseClient = useSupabaseClient();
  const [cardUrl, setCardUrl] = useState<string | undefined>();

  useEffect(() => {
    const downloadCardImage = async () => {
      // TODO: 画面の表示領域に入るまではdownloadしないようにしたい
      const { data, error } = await supabaseClient.storage
        .from('app-static-resources')
        .download(`cards/images/${card.category}/${card.imgFileName}`);
      console.log('--- doanload card image: ', data, error);
      if (data == null) {
        return;
      }
      const url = URL.createObjectURL(data);
      setCardUrl(url);
    };
    downloadCardImage();
  }, [card.category, card.imgFileName, supabaseClient]);
  return (
    <Image
      src={cardUrl ?? '/images/back.png'}
      width={width}
      height={width * (CARD_HEIGHT / CARD_WIDTH)}
      alt=""
      priority={true}
    />
  );
};
