import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import RegisterModal from '../components/RegisterModal';
import LoginModal from '../components/LoginModal';
import Header from '../components/navbar/Header';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Home: NextPage = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRank, setUserRank] = useState(0);
    const [userPoints, setUserPoints] = useState(0);
    const { t } = useTranslation('common');
    const router = useRouter();

    useEffect(() => {
        fetch('/api/currentUser')
          .then((res) => res.json())
          .then((data) => {
            if (data.user) {
              setCurrentUser(data.user);
              setUserPoints(data.user.rating);
              if (data.user.username && data.user.username.startsWith('temp-')) {
                router.push('/set-username');
                return;
              }
              fetch(`${API_URL}/users/ranking/${data.user.id}`)
                .then((res) => res.json())
                .then((data) => setUserRank(data.rank));
              Cookies.remove('generationCount');
            } else {
              router.push('/login');
            }
          });
      }, []);
    

    //@ts-ignore
      const username = currentUser?.username || 'Guest';
    //@ts-ignore
      const userRating = currentUser?.rating || 0;
    //@ts-ignore
      const solvedPuzzles = currentUser?.solvedPuzzles || 0;
    //@ts-ignore
      const unsolvedPuzzles = currentUser?.unsolvedPuzzles || 0;

      const suRatio = unsolvedPuzzles !== 0 ? (solvedPuzzles / unsolvedPuzzles).toFixed(2) : "N/A";

      const boxes = [
        { title: `${t('rating')} ${userRating}`, description: t('yourCurrentRating') },
        { title: `${t('solvedPuzzles')}: ${solvedPuzzles}`, description: t('numberOfPuzzlesYouHaveSolved') },
        { title: `${t('rank')} #${userRank}`, description: t('yourRankAmongAllUsers') },
        { title: `${t('suRatio')}:  ${suRatio}`, description: t('yourSuccessFailureRatio') },
      ];
      
      const cards = [
        {
          title: t('solvePuzzles'),
          description: t('solveInterestingPuzzles'),
          path: '/generate',
          buttonLabel: t('playnow'), 
        },
        {
          title: t('playRanked'),
          description: t('playAgainstOtherPlayers'),
          path: '/ranked',
          buttonLabel: t('playnow'),
        },
        {
          title: t('yourFavorites'),
          description: t('viewYourFavoritePuzzles'),
          path: '/favorites',
          buttonLabel: t('look'),
        },
      ];
      

      return (
        <div className="flex flex-col max-w-5xl mx-auto py-2 min-h-screen z-10">
          <Head>
            <title>sherlck.</title>
            <link rel="icon" href="/reallogo.ico" />
          </Head>
          <RegisterModal />
          <LoginModal />
          <Header currentUser={currentUser} />
    
          <div className="flex flex-col items-start justify-center w-full flex-1 px-4">
          <h1 className="text-2xl font-semibold mt-2">{t('welcomeBack')}, {username}</h1>
            
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-6">
            {boxes.map((box, index) => (
                <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow min-h-[100px]">
                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{box.title}</h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">{box.description}</p>
                </div>
            ))}
          </div>

          <main className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-4 mt-12 sm:mt-20">
  {cards.map((card, index) => (
    <div key={index} className="block max-w-sm p-8 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 min-h-[250px] relative">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{card.title}</h5>
      <p className="font-normal text-gray-700 dark:text-gray-400 mb-4">{card.description}</p>
      <Link href={card.path}>
        <button className="absolute bottom-2 right-4 text-white bg-yellow-800 px-4 py-2 rounded hover:bg-yellow-700">
        {card.buttonLabel}
        </button>
      </Link>
    </div>
  ))}
</main>



      </div>
    </div>
  );
};


export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
      ...await serverSideTranslations(locale as string, ['common']),
      locale,
    },
  });
    

export default Home;
