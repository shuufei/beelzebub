import { CardsPage, CardsPageProps } from '@beelzebub/card/ui';
import { GetServerSideProps } from 'next';
import { validateAuthorizedRequest } from '../../shared/ssr/validate-authorized-request';

export default CardsPage;

export const getServerSideProps: GetServerSideProps<CardsPageProps> = async (
  ctx
) => {
  const validateResult = await validateAuthorizedRequest(ctx);
  if (!validateResult.isValid) {
    return {
      redirect: validateResult.redirect,
    };
  }
  try {
    const res = await fetch(`http://localhost:4203/api/cards`, {
      headers: new Headers({
        cookie: ctx.req.headers.cookie ?? '',
      }),
    });
    //   TODO: error handling
    if (res.status !== 200) {
      return {
        redirect: {
          destination: '/auth/sign-in',
          permanent: false,
        },
      };
    }
    const data = await res.json();
    const cards = data.cards;
    return {
      props: {
        cards,
      },
    };
  } catch (error) {
    return {
      redirect: { destination: '/auth/sign-in', permanent: false },
    };
  }
};
