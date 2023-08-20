import { NextApiHandler } from 'next';
import { serialize } from 'cookie';

export const APP_ACCESS_CHECK_KEY = 'beelzebub-access-key';

const handler: NextApiHandler = (req, res) => {
  const query = req.query;
  const correctRequest = query.key === process.env.NEXT_BEELZEBUB_ACCESS_KEY;
  console.log('----', correctRequest, query, process.env.NEXT_BEELZEBUB_ACCESS_KEY)
  if (req.method !== 'GET' || !correctRequest) {
    return res.status(500).json({ message: 'can not access!' });
  }
  const cookie = serialize(APP_ACCESS_CHECK_KEY, query.key as string, {
    expires: new Date(process.env.NEXT_BEELZEBUB_ACCESS_KEY_EXPIRES),
    sameSite: 'lax',
    secure: true,
    httpOnly: true,
    path: '/',
  });
  res.setHeader('Set-Cookie', cookie);
  return res.redirect(307, '/auth/sign-in');
};

export default handler;
