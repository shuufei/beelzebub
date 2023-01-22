import { GetCardsRequestQuery } from '@beelzebub/card/api';
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
    const query: GetCardsRequestQuery = {
      // category: 'BT03,BT01,ST13,BT06',
      // lv: 'Lv.3,Lv6,-',
      cardtype: 'デジモン,テイマー',
      colors: 'red,black',
      includeParallel: 'true',
      offset: '100',
    };
    const searchParamsString = new URLSearchParams(query).toString();
    const res = await fetch(
      `http://localhost:4203/api/cards?${searchParamsString}`,
      {
        headers: new Headers({
          cookie: ctx.req.headers.cookie ?? '',
        }),
      }
    );
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
