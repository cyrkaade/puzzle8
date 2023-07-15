import type { NextPage, GetServerSideProps } from "next";
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



interface PuzzleItemProps {
    generatedpuzzle: string;
    currentUser: any;
    ptype: string;
  }
  
  const PuzzleItem: React.FC<PuzzleItemProps> = ({ generatedpuzzle, currentUser, ptype }) => {
    const [isFavorited, setFavorited] = useState(false);
    const API_URL = 'http://localhost:8000';
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
          className={`w-6 h-6 mr-4 text-purple-700 cursor-pointer transition duration-500 ease-in-out transform items-center ${isFavorited ? "scale-125" : ""}`}
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

const Ranked: NextPage = () => {

    const [loadingGenerate, setLoadingGenerate] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [answer, setAnswer] = useState("");
    const [ptype, setType] = useState<PuzzleType>("Riddle");
    let [difficulty, setDifficulty] = useState<string>("");
    const [generatedPuzzles, setGeneratedPuzzles] = useState<String>("");
    const [generatedAnswers, setGeneratedAnswers] = useState<String>("");
    const [isError, setIsError] = useState(false);
    const puzzleRef = useRef<null | HTMLDivElement>(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isPuzzleGenerated, setIsPuzzleGenerated] = useState(false);
    const [userPoints, setUserPoints] = useState(0);
    const [userResult, setUserResult] = useState<string>("");
    
    
  
    useEffect(() => {
      fetch('/api/currentUser')
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setCurrentUser(data.user);
            setUserPoints(data.user.rating);
            Cookies.remove('generationCount');
          } else {
            console.error(data.error);
          }
        });
    }, []);
  
    
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
    const prompt = `As an artificial intelligence, I have been asked to create a unique puzzle specifically designed for a user and difficulty level of ${difficulty}. The puzzle can be a brainteaser, a logical problem, a detective scenario or any other form of mentally challenging task.

    The key factors I must consider are that the puzzle should be innovative and uncommon, thereby providing a fresh challenge for the player. Considering the difficulty level, I need to ensure that the complexity of the puzzle is appropriate, neither too simple nor too complex, to maintain the user's interest and engagement.
    
    So, let's create this unique puzzle now. Word count should be 100-150 words. Please bear in mind that this puzzle is exclusively designed for a user and difficulty level of ${difficulty}. Here it is:`;

  
    const generatePuzzle = async (e: any) => {
      setIsPuzzleGenerated(false);
      e.preventDefault();
      setGeneratedPuzzles("");
      setLoadingGenerate(true);(true);
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
      setIsPuzzleGenerated(true);;
      
  
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
      setLoadingGenerate(false);
    };


    const answer_prompt = `I have logical puzzle: ${generatedPuzzles}. The user gave the answer: ${answer}. Please, check the user's answer and give me response: "Correct" or "Incorrect"`;



    const sendAnswer = async (e: any) => {
      e.preventDefault();
      setGeneratedAnswers("");
      if (answer.trim() === "") {
        setIsError(true);
        return;
      }
      setUserResult("");
      setGeneratedPuzzles("");
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
      console.log(response)
  
      if (!response.ok) {
        console.log(response)
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
      if (generatedAnswers.toLowerCase().includes('correct')) {
        setUserResult('Correct');
      } else {
        setUserResult('Incorrect');
      }
      scrollToPuzzles();
      setLoadingSubmit(false);
    };

  
    
  
  
    return (
      <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
        <Head>
          <title>Puzzle8</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <RegisterModal/>
        <LoginModal/>
        <Header currentUser={currentUser}/>
        <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
          <div className="flex justify-end items-center mr-4">
            Rating: {userPoints}
          </div>

          <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
            Ranked game
          </h1>

          <p className="text-slate-500 mt-5">Show everyone your deductive abilities!</p>
  
          <div className="max-w-xl w-full">
  
          {!loadingGenerate && !isPuzzleGenerated && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generatePuzzle(e)}
            >
              Generate puzzle &rarr;
            </button>
          )}
            {loadingGenerate && (
              <button
                className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
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
                        Problem:
                      </h2>
                    </div>
                    <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                      
                    {generatedPuzzles
                    .split("^^^.")
                    .map((generatedpuzzle, index) => (
                      <PuzzleItem generatedpuzzle={generatedpuzzle} key={index} currentUser={currentUser} ptype="Competitive puzzle" />
                    ))}
                </div>
              </>
            )}
          </div>
            <div className="flex mt-10 items-center space-x-3">
              <p className="text-left font-medium">
                Write your answer:{" "}
                <span className="text-slate-500">
                </span>
                
              </p>
            </div>
            <textarea
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setIsError(false);
              }}
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
              placeholder={
                "e.g. Martin is a Killer."
              }
            />
              {!loadingSubmit && (
              <button
              className={`bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full ${!isPuzzleGenerated ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={(e) => sendAnswer(e)}
              disabled={!isPuzzleGenerated}
            >
              Submit answer &rarr;
            </button>
            )}

            {isError && (
              <div className="mt-2 text-red-500">
                Please, enter the answer
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
              <div className="space-y-10 my-10">
                  {generatedAnswers && (
                      <>
                          <div>
                              <h2
                                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                                  ref={puzzleRef}
                              >
                                  Answer:
                              </h2>
                          </div>
                          <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                              
                              {generatedAnswers
                              .split("^^^.")
                              .map((generatedanswer, index) => (
                                  <PuzzleItem generatedpuzzle={generatedanswer} key={index} currentUser={currentUser} ptype="Competitive puzzle" />
                              ))}
                          </div>
                      </>
                  )}
              </div>
              <div className={`mt-2 text-${userResult === 'Correct' ? 'green-500' : 'red-500'}`}>
                {userResult === 'Correct' ? 'Well done! Your answer is correct :)' : userResult === 'Incorrect' ? 'Incorrect answer, try one more time' : ''}
              </div>
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
  
  export default Ranked;