import { Card } from '@beelzebub/shared/domain';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';

const CARD_IMG_HEIGHT = 600;
const CARD_IMG_WIDTH = 430;

export const CardImg: FC<{ card: Card; width: number }> = ({ card, width }) => {
  const supabaseClient = useSupabaseClient();
  const [cardUrl, setCardUrl] = useState<string | undefined>();

  useEffect(() => {
    const downloadCardImage = async () => {
      // TODO: 画面の表示領域に入るまではdownloadしないようにしたい
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
  return (
    <Image
      src={cardUrl ?? '/images/card-placeholder.png'}
      width={width}
      height={width * (CARD_IMG_HEIGHT / CARD_IMG_WIDTH)}
      alt=""
      priority={true}
    />
  );
};
