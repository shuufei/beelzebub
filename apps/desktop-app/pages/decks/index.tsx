import { DecksPage } from '@beelzebub/deck/ui';
import { GetServerSideProps } from 'next';
import { validateAuthorizedRequest } from '../../shared/ssr/validate-authorized-request';

export default DecksPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const validateResult = await validateAuthorizedRequest(ctx);
  if (!validateResult.isValid) {
    return {
      redirect: validateResult.redirect,
    };
  }
  try {
    return {
      props: {},
    };
  } catch (error) {
    return {
      redirect: { destination: '/auth/sign-in', permanent: false },
    };
  }
};
