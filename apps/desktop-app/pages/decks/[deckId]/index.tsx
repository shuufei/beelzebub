import { DeckPage, DeckPageProps } from '@beelzebub/deck/ui';
import { GetServerSideProps } from 'next';

export default DeckPage;

export const getServerSideProps: GetServerSideProps<DeckPageProps> = async (
  ctx
) => {
  const deckId = ctx.params?.deckId;
  if (typeof deckId !== 'string') {
    return {
      props: {
        deckId: '',
      },
    };
  }
  return {
    props: {
      deckId,
    },
  };
};
