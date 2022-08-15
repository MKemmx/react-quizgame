import React, { useState, useEffect } from "react";

interface Question {
  id: number;
  category: string;
  correct_answer: string;
  incorrect_answers: string[];
  question: string;
}

interface Checker {
  questionId: number;
  answer: string;
}

interface Message {
  isCorrect: boolean;
  content?: string;
}

const Questions: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(1);
  const [data, setData] = useState<Question[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<Message | null>(null);

  const handleCheck = (params: Checker) => {
    if (currentQuestion === data.length) {
      setIsPlaying(false);
      setGameOver(true);
    }
    const myAnswer = params;
    const question = data.find((item) => item.id === currentQuestion);

    if (question?.correct_answer === myAnswer.answer) {
      setScore(score + 1);
      setMessage({
        isCorrect: true,
        content: question.correct_answer,
      });
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    } else {
      setMessage({
        isCorrect: false,
        content: question?.correct_answer,
      });
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    }

    setCurrentQuestion(currentQuestion + 1);
  };

  const playGame = () => {
    setCurrentQuestion(1);
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
  };

  // Fetch questions
  const fetchQuestions = async () => {
    try {
      const res = await fetch(
        "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple"
      );
      const data = await res.json();
      const questions = data.results.map((item: Question, index: number) => {
        return {
          id: index + 1,
          category: item.category,
          correct_answer: item.correct_answer,
          incorrect_answers: [
            ...item.incorrect_answers,
            item.correct_answer,
          ].sort(() => Math.random() - 0.5),
          question: item.question,
        };
      });

      setData(questions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="h-screen w-full flex justify-center items-start bg-slate-200">
      {isPlaying ? (
        <div className="flex flex-col space-y-2 pt-4">
          <div className="h-36 flex items-center justify-center">
            {message !== null && (
              <>
                {message.isCorrect ? (
                  <>
                    <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
                      <div className="flex items-center justify-center w-12 bg-emerald-500">
                        <svg
                          className="w-6 h-6 text-white fill-current"
                          viewBox="0 0 40 40"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
                        </svg>
                      </div>
                      <div className="px-4 py-2 -mx-3">
                        <div className="mx-3">
                          <span className="font-semibold text-emerald-500 dark:text-emerald-400">
                            Nice!
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-200">
                            Your answer was correct.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
                      <div className="flex items-center justify-center w-12 bg-red-500">
                        <svg
                          className="w-6 h-6 text-white fill-current"
                          viewBox="0 0 40 40"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
                        </svg>
                      </div>
                      <div className="px-4 py-2 -mx-3">
                        <div className="mx-3">
                          <span className="font-semibold text-red-500 dark:text-red-400">
                            Wrong!
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-200">
                            The correct answer is{" "}
                            <span className="font-medium">
                              {message?.content}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {data
            .filter((item) => item.id === currentQuestion)
            .map((item) => {
              return (
                <div
                  key={item.id}
                  className="max-w-xl w-full px-4 py-5 mb-32 bg-white"
                >
                  {/* Question */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-medium">{`Quiz: ${currentQuestion}/${data.length}`}</p>
                      <p className="text-lg font-medium mb-4">{`Category ${item.category}`}</p>
                    </div>

                    <p className="text-lg font-medium mb-4">{`Score: ${score}`}</p>
                  </div>
                  <div className="py-2">
                    <h1 className="text-center font-medium text-2xl">
                      {item.question}
                    </h1>
                  </div>
                  {/* Choices */}
                  <div className="mt-5 space-y-3">
                    {item.incorrect_answers.map((choice, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          handleCheck({
                            questionId: item.id,
                            answer: choice,
                          });
                        }}
                        className={`bg-slate-200 hover:bg-slate-300 cursor-pointer py-3.5 rounded-md px-3 ${
                          message !== null && "pointer-events-none"
                        }`}
                      >
                        <p>{choice}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <>
          <div className="mt-52 max-w-lg w-full py-20 rounded-lg flex flex-col space-y-5 justify-center items-center bg-white">
            {gameOver ? (
              <div>
                <p className="text-lg">
                  You score is: <span className="font-medium"> {score} </span>{" "}
                  out of {data.length}
                </p>
              </div>
            ) : (
              <p className="text-2xl font-medium mb-2">Basic Quiz Game!</p>
            )}

            <button
              onClick={playGame}
              className="py-1.5 rounded-md font-medium uppercase px-5 bg-slate-200 hover:bg-slate-400 duration-200 ease-in-out"
            >
              {gameOver ? <p> Play Again </p> : <p> Play</p>}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Questions;
