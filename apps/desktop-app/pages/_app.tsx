import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useState } from 'react';
import { RecoilRoot } from 'recoil';
import { Header } from '../components/header';
import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  return (
    <>
      <Head>
        <title>Welcome to desktop-app!</title>
      </Head>
      <ChakraProvider>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}
        >
          <RecoilRoot>
            <Header />
            <Component {...pageProps} />
          </RecoilRoot>
        </SessionContextProvider>
      </ChakraProvider>
    </>
  );
}

export default CustomApp;
