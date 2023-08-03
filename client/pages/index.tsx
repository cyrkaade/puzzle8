import type { NextPage, GetServerSideProps, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { PuzzleType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/navbar/Header";
import LoadingDots from "../components/LoadingDots";
import DiscreteSliderLabel from "../components/Slider";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import RegisterModal from "../components/RegisterModal";
import LoginModal from "../components/LoginModal";
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Textarea } from "../@/components/ui/textarea";
import { useRouter } from "next/router";
import withUsername from "../actions/withUsername";


interface PuzzleItemProps {
  generatedpuzzle: string;
  currentUser: any;
  ptype: string;
}

const PuzzleItem: React.FC<PuzzleItemProps> = ({ generatedpuzzle, currentUser, ptype }) => {
  const [isFavorited, setFavorited] = useState(false);
  const { t } = useTranslation('common');
  const API_URL = 'http://localhost:8000';
  return (
    <div
      className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border flex items-center"
      onClick={() => {
        navigator.clipboard.writeText(generatedpuzzle);
        toast(`${t('copy')}`, { icon: "✂️" });
      }}
    >
      <div
        className={`w-6 h-6 mr-4 text-amber-600 cursor-pointer transition duration-500 ease-in-out transform items-center ${isFavorited ? "scale-125" : ""}`}
        onClick={(e) => {
          if (!currentUser) return;
          e.stopPropagation();
          setFavorited(!isFavorited);
          if (isFavorited) {
            fetch(`${API_URL}/favorites`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                user_id: currentUser?.email,
                puzzle: generatedpuzzle,
                puzzle_type: ptype
              })
            });
          } else {
            fetch(`${API_URL}/favorites`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                user_id: currentUser?.email,
                puzzle: generatedpuzzle,
                puzzle_type: ptype
              })
            });
          }
        }}
      >
        {isFavorited ? <FaHeart /> : <FaRegHeart />}
      </div>
      
      <p>{generatedpuzzle}</p>
    </div>
  );
};


const Home: NextPage<{locale: string}> = ({locale}) => { 

  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState("");
  const [ptype, setType] = useState<PuzzleType>("Riddle");
  const [difficulty, setDifficulty] = useState<number>(80);
  const [generatedPuzzles, setGeneratedPuzzles] = useState<String>("");

  const puzzleRef = useRef<null | HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState(null);
  const { t,i18n } = useTranslation('common');

  const router = useRouter();

  const modalRefStart = useRef<any>(null);
  const modalRefTypes = useRef<any>(null);
  

  const showModalStart = () => {
    modalRefStart.current.showModal();
  };
  
  const showModalTypes = () => {
    modalRefTypes.current.showModal();
  };

  useEffect(() => {
    if (router.query.loginRequired === 'true') {
      toast.error('Please, login to an account to have access to this page.');

      const { loginRequired, ...restQuery } = router.query;
      const newQuery = new URLSearchParams(restQuery as Record<string, string>).toString();
      const newUrl = newQuery ? `${router.pathname}?${newQuery}` : router.pathname;
      
      router.replace(newUrl, undefined, { shallow: true });
    }
  }, [router.query]);
  


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

  useEffect(() => {
    if (i18n.isInitialized) {
      setType(t('Riddle') as PuzzleType); 
    }
  }, [i18n.isInitialized, t]);

  
  const scrollToPuzzles = () => {
    if (puzzleRef.current !== null) {
      puzzleRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  let prompt: string
  if (locale === 'ru'){ 
  prompt = `Сгенерируйте 2 ${ptype} без хэштегов и с четкими надписями "1." и "2.".
  Убедитесь, что каждая сгенерированная головоломка содержит менее 200 символов, уникальна, интересна и креативна. Стиль головоломки (атмосфера) должен быть таким: ${style}${
  style.slice(-1) === "." ? "" : "."
} Сложность: ${difficulty}. Не давайте ответа и решения.`;
}
else {
  prompt = `Generate 2 ${ptype}s with no hashtags and clearly labeled "1." and "2.".
  Make sure each generated puzzle is less than 200 characters, is unique, interesting and creative. The puzzle style (vibe) should be like: ${style}${
style.slice(-1) === "." ? "" : "."
} Difficulty: ${difficulty}. Don't give the answer and solution.`;
}

  const generatePuzzle = async (e: any) => {
    e.preventDefault();
    setGeneratedPuzzles("");
    setLoading(true);
    if (!currentUser) {
      const generationCount = Cookies.get('generationCount') ? parseInt(Cookies.get('generationCount') as string) : 0;
      if (generationCount >= 2) {
        setLoading(false);
        toast(`${t('limit')}`);
        return;
      }
      Cookies.set('generationCount', (generationCount + 1).toString());
    }
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;
    if (!data) {
      return;
    }

    const onParse = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === "event") {
        const data = event.data;
        try {
          const text = JSON.parse(data).text ?? ""
          setGeneratedPuzzles((prev) => prev + text);
        } catch (e) {
          console.error(e);
        }
      }
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    const parser = createParser(onParse);
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      parser.feed(chunkValue);
    }
    scrollToPuzzles();
    setLoading(false);
  };

  


  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen z-10">

      
      
      <Head>
        <title>sherlck.</title>
        <link rel="icon" href="/reallogo.ico" />
      </Head>
      <RegisterModal/>
      <LoginModal/>
      <Header currentUser={currentUser}/>
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
      {/* <img className="hidden lg:block absolute right-20 top-60 sm:w-24 md:w-24 lg:w- z-0" src="/9.png" alt="Upside Down Triangle" /> 
    <img className="hidden lg:block absolute left-10 bottom-30 sm:w-28 md:w-28 lg:w-32 z-0" src="/10.png" alt="Heart" /> 
    <img className="hidden lg:block absolute right-10 bottom-[-200px] sm:w-28 md:w-32 lg:w-48 z-0" src="/12.png" alt="Square" /> */}

        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
        {t('home_title')}
        </h1>
        <a className="text-slate-500 mt-5 cursor-pointer hover:underline" onClick={showModalStart}>{t('first_time')}</a>
        <dialog ref={modalRefStart} id="my_modal_5" className="modal modal-bottom sm:modal-middle" data-theme="light">
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg">{t('welcome')}</h3>
            <img src="logos.png"/>
            <p className="py-4 text-left">
            {t('excited')}
            <ul>
              <li><strong>{t('main_page')}</strong>: {t('forwhat')}.</li>
              <li><strong>{t('ranked')}</strong>: {t('engage')}</li>
              <li><strong>{t('favorites')}</strong>: {t('easily')}</li>
              <li><strong>{t('explore')}</strong>: {t('increase')}</li>
            </ul>
          </p>
          <p className="py-4 text-left">
          {t('calling')}
          </p>

            <div className="modal-action">
              <button className="btn">{t('close')}</button>
            </div>
          </form>
        </dialog>

        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/number-one.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
            {t('style')}
              <span className="text-slate-500">
                {t('graystyle')}
              </span>
            </p>
          </div>
          <Textarea value={style}
            onChange={(e) => setStyle(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5 light-mode"
            placeholder={
              `${t('egstyle')}`
            }/>

          <div className="flex mb-5 items-center space-x-3">
            <Image src="/number-two.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">{t('type')}</p>
            <div onClick={showModalTypes} className="cursor-pointer">
            <Image src="/info.png" width={20} height={20} alt="Tooltip Icon" />
          </div>
          </div>
          <div className="block">
            <DropDown ptype={ptype} setType={(newType) => setType(newType)} />
          </div>

          <div>
          <dialog ref={modalRefTypes} id="my_modal_5" className="modal modal-bottom sm:modal-middle" data-theme="light">
  <form method="dialog" className="modal-box">
    <h3 className="font-bold text-lg">{t('types_header')}</h3>
    <img src="puzzle.jpg" />
    <p className="py-4 text-left">
      <strong>{t('Puzzle')}:</strong>{t('riddle_description')}
    </p>
    <p className="py-4 text-left">
      <strong>{t('logical_puzzle')}:</strong> {t('logical_description')}
    </p>
    <p className="py-4 text-left">
      <strong>{t('Brainteaser')}:</strong> {t('brainteaser_description')}
    </p>
    <p className="py-4 text-left">
      <strong>{t('Anagram')}:</strong> {t('anagram_description')}
    </p>
    <p className="py-4 text-left">
      <strong>{t('Trivia')}:</strong> {t('trivia_description')}
    </p>
    <div className="modal-action">
      <button className="btn">{t('close')}</button>
    </div>
  </form>
</dialog>

        </div>

          <div className="flex items-center space-x-3 mt-5">
            <Image src="/number-three.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">{t('difficulty')}</p>
          </div>
          <DiscreteSliderLabel onChange={setDifficulty} />

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generatePuzzle(e)}
            >
              {t('generate_puzzle')} &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-10">
          {generatedPuzzles && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={puzzleRef}
                >
                  {t('generated_puzzles')}
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                
              {generatedPuzzles
              .substring(generatedPuzzles.indexOf("1") + 3)
              .split("2.")
              .map((generatedpuzzle, index) => (
                <PuzzleItem generatedpuzzle={generatedpuzzle} key={index} currentUser={currentUser} ptype={ptype.toLowerCase()} />
              ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
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
