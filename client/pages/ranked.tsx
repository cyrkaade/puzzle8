import type { NextPage, GetServerSideProps, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { PuzzleType } from "../components/DropDown";
import Footer from "../components/Footer";
import Header from "../components/navbar/Header";
import LoadingDots from "../components/LoadingDots";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import RegisterModal from "../components/RegisterModal";
import LoginModal from "../components/LoginModal";
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Textarea } from "../@/components/ui/textarea";
import withUsername from "../actions/withUsername";
import { getSessionNow } from "../actions/getCurrentUser";
import { getSession } from "next-auth/react";

// import withUsername from "../actions/withUsername";


const API_URL = 'https://sherlck-backend.onrender.com';

interface PuzzleItemProps {
    generatedpuzzle: string;
    currentUser: any;
    ptype: string;
  }
  
  const PuzzleItem: React.FC<PuzzleItemProps> = ({ generatedpuzzle, currentUser, ptype }) => {
    const [isFavorited, setFavorited] = useState(false);
    return (
      <div
        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border flex items-center"
        onClick={() => {
          navigator.clipboard.writeText(generatedpuzzle);
          toast("puzzle copied to clipboard", { icon: "✂️" });
        }}
      >
        {currentUser && (
        <div
          className={`w-6 h-6 mr-4 text-amber-600 cursor-pointer transition duration-500 ease-in-out transform items-center ${isFavorited ? "scale-125" : ""}`}
          onClick={(e) => {
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
        )}
        <p>{generatedpuzzle}</p>
      </div>
    );
  };

const Ranked: NextPage<{locale: string}> = ({locale}) => { 

    const [loadingGenerate, setLoadingGenerate] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [answer, setAnswer] = useState("");
    let [difficulty, setDifficulty] = useState<string>("");
    const [generatedPuzzles, setGeneratedPuzzles] = useState<string>("");
    const [generatedAnswers, setGeneratedAnswers] = useState<String>("");
    const [isError, setIsError] = useState(false);
    const puzzleRef = useRef<null | HTMLDivElement>(null);
    const [currentUser, setCurrentUser] = useState<any | null>(null);
    const [isPuzzleGenerated, setIsPuzzleGenerated] = useState(false);
    const [userPoints, setUserPoints] = useState(0);
    const [userResult, setUserResult] = useState<string>("");
    const [answerMessage, setAnswerMessage] = useState<string | null>(null);
    const [timer, setTimer] = useState<number>(0);
    const [disableButton, setDisableButton] = useState<boolean>(false);
    const [timerMessage, setTimerMessage] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [ratingMessage, setRatingMessage] = useState<string | null>(null);
    const [userRank, setUserRank] = useState(0);
    const [imageURL, setImageURL] = useState('');
    const [isLastAnswerCorrect, setIsLastAnswerCorrect] = useState<boolean>(false);
    const [correctAnswer, setCorrectAnswer] = useState<String>("");
    const puzzleTypes = ["Lateral Thinking Problem", "Logic Puzzle", "Mathematical Riddle", "Detective Riddle", "Coded Message", "Anagram Puzzle", "Trivia Puzzle"];


    
    


    const { t } = useTranslation('common');

    useEffect(() => {
      if(isPuzzleGenerated) {
        generateImage(generatedPuzzles);
      }
    }, [isPuzzleGenerated]);
    
     
    const handleShowAnswer = async () => {
      setShowAnswer(true);
      generateAnswer();
      
      if (!isLastAnswerCorrect) {
      await fetch("/api/rateDown", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
        }),
      });
    }
    
      setTimer(0);
      setDisableButton(true);
      setGameOver(true);
    

      updateUserData();
    };

    
    useEffect(() => {
      let timerId: NodeJS.Timeout | null = null;
    
      if (timer > 0) {
        timerId = setTimeout(() => setTimer(timer - 1), 1000);
      } else if (timer === 0 && isPuzzleGenerated && !answerMessage && !gameOver) {
        setDisableButton(true);
        setTimerMessage("Time went out");
        fetch("/api/rateDown", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.id,
          }),
        });

      }
    
      return () => {
        if (timerId) {
          clearTimeout(timerId);
        }
      };
    }, [timer, isPuzzleGenerated, answerMessage, gameOver]);

    
    
    
    const updateUserRank = async () => {
      if (currentUser) {
        const response = await fetch(`${API_URL}/users/ranking/${currentUser.id}`);
        const data = await response.json();
        setUserRank(data.rank);
      }
    };


    useEffect(() => {
      fetch('/api/currentUser')
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setCurrentUser(data.user);
            setUserPoints(data.user.rating);
            fetch(`${API_URL}/users/ranking/${data.user.id}`)
              .then((res) => res.json())
              .then((data) => setUserRank(data.rank));
            Cookies.remove('generationCount');
          } else {
            console.error(data.error);
          }
        });
    }, []);
    

    const handleNext = (e: any) => {
      e.preventDefault();
      setAnswer("");
      setAnswerMessage(null);
      setShowAnswer(false);
      setGeneratedAnswers("");
      generatePuzzle(e);
    }

const updateUserData = async () => {
  const res = await fetch('/api/currentUser');
  const data = await res.json();
  if (data.user) {
    let oldRating = userPoints;
    let newRating = data.user.rating;
    setCurrentUser(data.user);
    setUserPoints(newRating);
        
    let difference = newRating - oldRating;
    if (difference > 0) {
      toast.success(`Rating +${difference}`);
    } else if (difference < 0) {
      toast.error(`Rating ${difference}`);
    }

    updateUserRank();
  } else {
    console.error(data.error);
  }
};


    const handleSkip = async (e: any) => {
      e.preventDefault();
    
      if(disableButton) {
        return;
      }
    
      await fetch("/api/rateDown", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
        }),
      });
    
      setAnswer("");
      setAnswerMessage(null);
      setShowAnswer(false);
      setGeneratedAnswers("");
      generatePuzzle(e);
      setTimer(300);
      setGameOver(true);
    

      updateUserData();
    };
    

    
  
    
    const scrollToPuzzles = () => {
      if (puzzleRef.current !== null) {
        puzzleRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    
    if (userPoints < 700)
      difficulty = "very easy";
    else if (userPoints < 1100)
        difficulty = "easy"
    else if (userPoints < 1900)
        difficulty = "medium"
    else if (userPoints < 2300)
        difficulty = "hard"
    else if (userPoints >= 2300)
        difficulty = "very hard"


    const generatePuzzle = async (e: any) => {
      setIsPuzzleGenerated(false);
      setTimerMessage(null);
      setAnswerMessage(null);
      setGeneratedAnswers("");
      e.preventDefault();
      setGeneratedPuzzles("");
      setImageURL("")
      setIsLastAnswerCorrect(false);
      const puzzle_type = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];

      let prompt: string
      if (locale === 'ru'){ 
        prompt = `Как продвинутый ИИ, создайте уникальную головоломку специально для пользователя со сложностью ${difficulty}. Эта головоломка должна быть:

        1. Инновационной и необычной, не включающей в себя клишированных тем, таких как "два стража и дилемма ложь/правда".
        2. Соответствующей указанному уровню сложности, привлекая интерес пользователя, не будучи слишком простой или чрезмерно сложной.
        3. Состоять из 80 до 180 слов, представляя собой краткое задание.
        
        Для этого запроса создайте головоломку, которая относится к категории ${puzzle_type}. Это может быть задача на сообразительность, математическая головоломка, тайная загадка, задание на невербальное мышление, детективный сценарий или любая другая умственно стимулирующая задача, требующая латерального мышления. Избегайте явных решений в самом тексте головоломки и выведите только текст головоломки.`;        
      }

      else {
        prompt = `As an advanced AI, create a unique puzzle specifically for a user with a difficulty level of ${difficulty}. This puzzle should be:

        1. Innovative and uncommon, not involving clichéd themes like 'two guards and a lie/truth dilemma'.
        2. Appropriate for the specified difficulty level, engaging the user's interest without being overly simple or excessively complex.
        3. Comprised of 80 to 180 words, offering a concise challenge.
        
        For this request, generate a puzzle that falls under the category of ${puzzle_type}. This could be a brainteaser, mathematical conundrum, cryptic riddle, non-verbal reasoning challenge, detective scenario, or any other mentally stimulating task requiring lateral thinking. Avoid explicit solutions within the puzzle text itself.`;
        
      }
      setLoadingGenerate(true);
      if (!currentUser) {
        const generationCount = Cookies.get('generationCount') ? parseInt(Cookies.get('generationCount') as string) : 0;
        if (generationCount >= 2) {
          setLoadingGenerate(true);(false);
          toast("I'm sorry, it seems like you've already used up all your generations. To get unlimited generations, please sign up.");
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
      })
      setTimer(300);
      setDisableButton(false);
      setTimerMessage("");
      
  
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
      // setGeneratedPuzzles(generatedPuzzle);
      // generateImage(generatedPuzzle);

      
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
      setIsPuzzleGenerated(true);;
      scrollToPuzzles();
      setLoadingGenerate(false);
    };

    const generateImage = async (generatedPuzzles: string) => {
      const imageRes = await fetch(`${API_URL}/generateImage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: generatedPuzzles, 
        }),
      })
      
      if (imageRes.ok) {
        const imageData = await imageRes.json();
        setImageURL(imageData.image_url);
      }
    };


    const answer_prompt = `Here is a logical puzzle: ${generatedPuzzles}. The user's proposed solution is: ${answer}. Please evaluate this answer accurately. The response should be a SINGLE word, devoid of spaces, symbols, or punctuation. The ONLY valid responses are "Correct" or "Incorrect". Please follow these guidelines strictly.`;

    


    const sendAnswer = async (e: any) => {
      e.preventDefault();
      setAnswerMessage(null);
      setGeneratedAnswers("");
      let finalGeneratedAnswer = "";
      if (answer.trim() === "") {
        setIsError(true);
        return;
      }
      setUserResult("");
      setLoadingSubmit(true);
      if (!currentUser) {
        const generationCount = Cookies.get('generationCount') ? parseInt(Cookies.get('generationCount') as string) : 0;
        if (generationCount >= 2) {
          setLoadingSubmit(false);
          toast("I'm sorry, it seems like you've already used up all your generations. To get unlimited generations, please sign up.");
          return;
        }
        Cookies.set('generationCount', (generationCount + 1).toString());
      }
      const response = await fetch("/api/checkAnswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer_prompt,
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
            finalGeneratedAnswer += text;
            setGeneratedAnswers((prev) => prev + text);
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
    
      if (finalGeneratedAnswer.trim().toLowerCase() === 'correct') {
        setAnswerMessage('Well done! Your answer is correct :)');
        setDisableButton(true);
        setTimer(0);
        setTimerMessage(null);
        setIsLastAnswerCorrect(true); 
      
        await fetch("/api/rateUp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.id,
          }),
        });
      

        updateUserData();
      } else {
        setAnswerMessage('Incorrect answer, try one more time');
        setIsLastAnswerCorrect(false);
      }
      

    
      scrollToPuzzles();
      setLoadingSubmit(false);
      
    };

    const generateAnswer = async () => {
      let answerPrompt = ""
      if (locale==='ru'){
        answerPrompt = `На основе представленной головоломки, ${generatedPuzzles}, предоставьте краткое и точное решение. Помните, что объяснение не должно превышать 80 слов и оно должно корректно решить головоломку. Избегайте ненужной детализации или несвязанной информации в вашем ответе.`;

      } else {
        answerPrompt = `Based on the provided puzzle, ${generatedPuzzles}, provide a succinct and accurate solution. Remember, the explanation should not exceed 80 words and it must correctly resolve the puzzle. Ensure to avoid unnecessary elaboration or unrelated information in your response.`;

      }
      setCorrectAnswer("");
      const response = await fetch("/api/generateAnswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answerPrompt,
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
            const text = JSON.parse(data).text ?? "";
            setCorrectAnswer((prev) => prev + text);
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
    }
    
  
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
        {t('rating')} {userPoints} | {t('rank')} #{userRank} | {t('timer')} {timer} {t('secs_left')}
        </div>

          <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          {t('ranked_game')}
          </h1>

          <p className="text-slate-500 mt-5">{t('deductive_abilities')}</p>
  
          <div className="max-w-xl w-full">
  
          {!loadingGenerate && !isPuzzleGenerated && (
            <button
              className="bg-yellow-800
              rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-yellow-800/90 w-full"
              onClick={(e) => generatePuzzle(e)}
            >
              {t('generate_puzzle')}
            </button>
          )}
            {loadingGenerate && (
              <button
                className="bg-yellow-800 rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-yellow-800/80 w-full"
                disabled
              >
                <LoadingDots color="white" style="large" />
              </button>
            )}
              <div className="space-y-10 my-10">
                {generatedPuzzles && (
                  <>
                    <div>
                      <h2
                        className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                        ref={puzzleRef}
                      >
                        {t('problem')}
                      </h2>
                    </div>
                    <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                      
                    {generatedPuzzles
                    .split("^^^.")
                    .map((generatedpuzzle, index) => (
                      <PuzzleItem generatedpuzzle={generatedpuzzle} key={index} currentUser={currentUser} ptype="Competitive puzzle" />
                    ))}
                     
                    <img src={imageURL}></img>
                </div>
              </>
            )}
          </div>
            <div className="flex mt-10 items-center space-x-3">
              <p className="text-left font-medium">
              {t('write_your_answer')}{" "}
                <span className="text-slate-500">
                </span>
                
              </p>
            </div>

            <Textarea
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setIsError(false);
            }}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5 light-mode"
            placeholder={
              `${t('placeholder_text')}`
            }/>
            
              {!loadingSubmit && (
              <button
              className={`bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full ${!isPuzzleGenerated || disableButton || answerMessage === `${t('please_enter_answer')}` ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={(e) => sendAnswer(e)}
              disabled={!isPuzzleGenerated || disableButton || answerMessage === `${t('correct_answer_message')}`}
            >
              {t('submit_answer')}
            </button>
            )}


            {isError && (
              <div className="mt-2 text-red-500">
                {t('please_enter_answer')}
              </div>
            )}

            {answerMessage && (
              <div className={generatedAnswers.trim().toLowerCase() === 'correct' ? "mt-2 text-green-500" : "mt-2 text-red-500"}>
                {answerMessage}
              </div>
            )}
            {timerMessage && (
              <div className="mt-2 text-red-500">
                {timerMessage}
              </div>
            )}

            {loadingSubmit && (
              <button
                className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                disabled
              >
                <LoadingDots color="white" style="large" />
              </button>
            )}
              <div className={`mt-2 text-${userResult === 'Correct' ? 'green-500' : 'red-500'}`}>
                {userResult === 'Correct' ? 'Well done! Your answer is correct :)' : userResult === 'Incorrect' ? 'Incorrect answer, try one more time' : ''}
              </div>
              {
              isPuzzleGenerated && (
                <div className="flex flex-col items-center mt-4 pt-8">

                  <div className="flex justify-center space-x-4">
                    <button
                      className={`bg-black rounded-xl text-white font-medium px-4 py-2 hover:bg-black/80 ${!isPuzzleGenerated || disableButton || timer <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={(e) => handleSkip(e)}
                      disabled={!isPuzzleGenerated || disableButton || timer <= 0}
                    >
                      {t('skip')}
                    </button>
                    <div>
                    <button
                      className={`bg-black rounded-xl text-white font-medium px-4 py-2 hover:bg-black/80 ${
                        !isPuzzleGenerated || (answerMessage === `${t('incorrect_answer_message')}` && !timerMessage) || (timer > 0 && !timerMessage)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={(e) => handleNext(e)}
                      disabled={
                        !isPuzzleGenerated || (answerMessage === `${t('incorrect_answer_message')}` && !timerMessage) || (timer > 0 && !timerMessage)
                      }
                    >
                      {t('next')}
                    </button>
                    {ratingMessage && <span>{ratingMessage}</span>}
                    </div>
                  </div>
                  <a
                    className="underline text-yellow-800 hover:text-yellow-600 cursor-pointer mt-4"
                    onClick={handleShowAnswer}
                  >
                    {t('show_answer')}
                  </a>

                  {showAnswer && (
                    <div className="mt-2 text-black">
                      {t('answer')} {correctAnswer}
                    </div>
                  )}
                </div>
              )
}
          </div>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{ duration: 2000 }}
          />
          <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        </main>
        <Footer />
      </div>
    );
  };


  export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, locale } = context;
  
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
        locale, 
      },
    };
  }

  
  export default withUsername(Ranked);