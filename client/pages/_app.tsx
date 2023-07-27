import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { appWithTranslation } from 'next-i18next';
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
      </SessionProvider>
      <Analytics />
    </>
  );
}

export default appWithTranslation(MyApp);


