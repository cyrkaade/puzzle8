import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import Header from "../components/navbar/Header";
import RegisterModal from "../components/RegisterModal";
import LoginModal from "../components/LoginModal";
import Cookies from 'js-cookie';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withUsername from "../actions/withUsername";
import { getSession } from "next-auth/react";
import { toast } from 'react-hot-toast';

const Explore: NextPage = () => {
    const [currentUser, setCurrentUser] = useState<any | null>(null);

    useEffect(() => {
        fetch('/api/currentUser')
          .then((res) => res.json())
          .then((data) => {
            if (data.user) {
              setCurrentUser(data.user);
              Cookies.remove('generationCount');
            } else {
              console.error(data.error);
            }
          });
      }, []);

return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
          <title>sherlck.</title>
          <link rel="icon" href="/reallogo.ico" />
      </Head>
      <RegisterModal/>
      <LoginModal/>
      <Header currentUser={currentUser}/>
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">

      <div className="flex justify-end items-center mr-4">
        Coming soon...
      </div>
      </main>
      </div>
)
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, locale } = context;

  // Get the user's session based on the request
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: '/?loginRequired=true',
        permanent: false,
      },
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as string, ['common'])),
      // otherPropsYouMightNeed...
    },
  };
}


export default withUsername(Explore);