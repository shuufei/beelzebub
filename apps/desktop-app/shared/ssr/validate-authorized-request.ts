import { InvalidAppAccessToken, Unauthorized } from '@beelzebub/shared/errors';
import { GetServerSideProps, Redirect } from 'next';
import { validateAppAccessToken } from './validate-app-access-token';
import { validateAuthorized } from './validete-authorized';

type ValidRequestResult = {
  isValid: true;
};
type InvalidRequestResult = {
  isValid: false;
  redirect: Redirect;
};

export const validateAuthorizedRequest = async (
  ctx: Parameters<GetServerSideProps>[0]
): Promise<ValidRequestResult | InvalidRequestResult> => {
  try {
    validateAppAccessToken(ctx.req.headers.cookie ?? '');
    await validateAuthorized(ctx);
  } catch (error) {
    if (error instanceof Unauthorized) {
      return {
        isValid: false,
        redirect: {
          destination: '/auth/sign-in',
          permanent: false,
        },
      };
    } else if (error instanceof InvalidAppAccessToken) {
      return {
        isValid: false,
        redirect: {
          destination: '/service-suspended',
          permanent: true,
        },
      };
    } else {
      return {
        isValid: false,
        redirect: {
          destination: '/service-suspended',
          permanent: true,
        },
      };
    }
  }
  return {
    isValid: true,
  };
};
