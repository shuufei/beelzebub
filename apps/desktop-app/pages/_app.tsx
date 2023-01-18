import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useState } from 'react';
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
          <Component {...pageProps} />
        </SessionContextProvider>
      </ChakraProvider>
    </>
  );
}

export default CustomApp;
