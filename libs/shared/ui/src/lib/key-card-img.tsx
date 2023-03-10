import { Deck } from '@beelzebub/shared/domain';
import Image from 'next/image';
import { FC } from 'react';
import { CardImg } from './card-img';

export const KeyCardImg: FC<{ keyCard: Deck['keyCard']; width: number }> = ({
  keyCard,
  width,
}) => {
  return keyCard != null ? (
    <CardImg
      categoryId={keyCard.categoryId}
      imgFileName={keyCard.imgFileName}
      width={width}
    />
  ) : (
    <Image
      src={'/images/card-placeholder.png'}
      width={width}
      height={width * (600 / 430)}
      alt=""
    />
  );
};
