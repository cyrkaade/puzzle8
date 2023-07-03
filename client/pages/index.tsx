import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { PuzzleType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import DiscreteSliderLabel from "../components/Slider";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import RegisterModal from "../components/RegisterModal";
import LoginModal from "../components/LoginModal";
import getCurrentUser from "../actions/getCurrentUser";
import { User } from "@prisma/client";
import { log } from "console"
import { useQuery } from 'react-query';


interface HomeProps {
  currentUser: User | null;
}

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState("");
  const [ptype, setType] = useState<PuzzleType>("Riddle");
  const [difficulty, setDifficulty] = useState<number>(80);
  const [generatedPuzzles, setGeneratedPuzzles] = useState<String>("");

  const puzzleRef = useRef<null | HTMLDivElement>(null);

  const scrollToPuzzles = () => {
    if (puzzleRef.current !== null) {
      puzzleRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const prompt = `Generate 2 ${ptype}s with no hashtags and clearly labeled "1." and "2.".
      Make sure each generated puzzle is less than 200 characters, is unique, interesting and creative. The puzzle style (vibe) should be like: ${style}${
    style.slice(-1) === "." ? "" : "."
  } Difficulty: ${difficulty}. Don't give the answer and solution.`;

  const generatePuzzle = async (e: any) => {
    e.preventDefault();
    setGeneratedPuzzles("");
    setLoading(true);
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
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Puzzle8</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RegisterModal/>
      <LoginModal/>
      <Header/>
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
          href="https://github.com/Nutlope/twitterpuzzle"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>Star on GitHub</p>
        </a>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Generate your favourite puzzles
        </h1>
        <p className="text-slate-500 mt-5">52 users overall</p>

        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Write puzzle style (vibe){" "}
              <span className="text-slate-500">
                (or write a few sentences about puzzle)
              </span>
              .
            </p>
          </div>
          <textarea
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "e.g. Cyberpunk style, 18th century style"
            }
          />

          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">Select puzzle type.</p>
          </div>
          <div className="block">
            <DropDown ptype={ptype} setType={(newType) => setType(newType)} />
          </div>

          <div className="flex items-center space-x-3 mt-5">
            <Image src="/number-three.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">Select puzzle difficulty.</p>
          </div>
          <DiscreteSliderLabel onChange={setDifficulty} />

          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generatePuzzle(e)}
            >
              Generate puzzle &rarr;
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
                  Your generated puzzles
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {generatedPuzzles
                  .substring(generatedPuzzles.indexOf("1") + 3)
                  .split("2.")
                  .map((generatedpuzzle) => {
                    return (
                      <div
                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedpuzzle);
                          toast("puzzle copied to clipboard", {
                            icon: "✂️",
                          });
                        }}
                        key={generatedpuzzle}
                      >
                        <p>{generatedpuzzle}</p>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
