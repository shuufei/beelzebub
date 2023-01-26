import { DeckEditPage, DeckEditPageProps } from '@beelzebub/deck/ui';
import { GetServerSideProps } from 'next';

export default DeckEditPage;

export const getServerSideProps: GetServerSideProps<DeckEditPageProps> = async (
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
