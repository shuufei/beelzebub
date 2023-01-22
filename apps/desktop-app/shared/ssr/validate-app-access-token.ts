import { InvalidAppAccessToken } from '@beelzebub/shared/errors';
import { parse } from 'cookie';
import { APP_ACCESS_CHECK_KEY } from '../../pages/api/set-cookie-app-access-key';

export const validateAppAccessToken = (cookie: string) => {
  const parsedCookies = parse(cookie);
  const validRequest =
    parsedCookies[APP_ACCESS_CHECK_KEY] ===
    process.env.NEXT_BEELZEBUB_ACCESS_KEY;
  if (!validRequest) {
    throw new InvalidAppAccessToken();
  }
  return;
};
