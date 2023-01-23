import { GetServerSideProps } from 'next';
import { FC } from 'react';
import { validateAuthorizedRequest } from '../../shared/ssr/validate-authorized-request';

const VsPage: FC = () => {
  return (
    <main>
      <h2>VS</h2>
    </main>
  );
};
export default VsPage;

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
