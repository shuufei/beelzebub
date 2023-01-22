import { InvalidAppAccessToken } from '@beelzebub/shared/errors';
import { GetServerSideProps, Redirect } from 'next';
import { validateAppAccessToken } from './validate-app-access-token';

type ValidRequestResult = {
  isValid: true;
};
type InvalidRequestResult = {
  isValid: false;
  redirect: Redirect;
};

export const validateAppAccessRequest = (
  req: Parameters<GetServerSideProps>[0]['req']
): ValidRequestResult | InvalidRequestResult => {
  try {
    validateAppAccessToken(req.headers.cookie ?? '');
  } catch (error) {
    if (error instanceof InvalidAppAccessToken) {
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
