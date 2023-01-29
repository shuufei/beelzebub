import { BoardPage, BoardPageProps } from '@beelzebub/vs/ui';
import { GetServerSideProps } from 'next';
import { validateAuthorizedRequest } from '../../shared/ssr/validate-authorized-request';

export default BoardPage;

export const getServerSideProps: GetServerSideProps<BoardPageProps> = async (
  ctx
) => {
  const validateResult = await validateAuthorizedRequest(ctx);
  if (!validateResult.isValid) {
    return {
      redirect: validateResult.redirect,
    };
  }
  try {
    return {
      props: {
        skywayApiKey: process.env.NEXT_SKYWAY_API_KAY,
      },
    };
  } catch (error) {
    return {
      redirect: { destination: '/auth/sign-in', permanent: false },
    };
  }
};
