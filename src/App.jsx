import { useState, useEffect } from "react";
import { nanoid } from "nanoid";

import Question from "./components/Question";
import BezierShape from "./components/BezierShape";
import mockQuestions from "./mock/questions";
import Footer from "./components/Footer";

export default function App() {
  const url =
    "https://opentdb.com/api.php?amount=5&category=9&difficulty=easy&type=multiple";

  const states = {
    greet: 0,
    think: 1,
    check: 2,
  };

  const [state, setState] = useState(0);
  const [counterQuiz, setCounterQuiz] = useState(0);
  const [counterCorrect, setCounterCorrect] = useState(0);
  const [data, setData] = useState([]);

  function start() {
    setState(states.think);
  }

  function finish() {
    let isFinished = true;
    let nextCounterCorrect = 0;
    data.forEach((item) => {
      if (item.aIndexPicked === -1) isFinished = false;
      if (item.aIndexPicked === item.aIndexCorrect) nextCounterCorrect++;
    });

    if (isFinished) {
      setCounterCorrect(nextCounterCorrect);
      setState(states.check);
    } else {
      tremble();
      setTimeout(() => {
        stick();
      }, 1000);
    }
  }

  function restart() {
    setState(states.think);
    setCounterQuiz((prevCounterQuiz) => prevCounterQuiz + 1);
  }

  function parseResponse(response) {
    return response.results.map((result, index) => {
      const answers = [...result.incorrect_answers, result.correct_answer];
      const aIndexCorrect = shuffle(answers);
      return {
        question: result.question,
        answers: answers,
        qIndex: index,
        aIndexCorrect: aIndexCorrect,
        aIndexPicked: -1,
        isTrembling: false,
      };
    });
  }

  function handlePick(qIndex, aIndex) {
    setData((prevData) => {
      const nextData = [...prevData];
      nextData[qIndex].aIndexPicked = aIndex;
      return nextData;
    });
  }

  function tremble() {
    setData((prevData) => {
      const nextData = [...prevData];
      nextData.map((item) => {
        if (item.aIndexPicked === -1) item.isTrembling = true;
      });
      return nextData;
    });
  }

  function stick() {
    setData((prevData) => {
      const nextData = [...prevData];
      nextData.map((item) => {
        item.isTrembling = false;
      });
      return nextData;
    });
  }

  function shuffle(array) {
    const index = Math.ceil(Math.random() * 3);
    const buf = array[index];
    array[index] = array[array.length - 1];
    array[array.length - 1] = buf;
    return index;
  }

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((response) => setData(parseResponse(response)))
      .catch(() => setData(parseResponse(mockQuestions)));
  }, [counterQuiz]);

  const questionElements = data.map((item) => (
    <Question
      key={nanoid()}
      question={item}
      state={state - 1}
      handlePick={handlePick}
    ></Question>
  ));

  const pages = [
    <div key={nanoid()} className="start-page">
      <BezierShape positon={"top"} color={"yellow"} />
      <BezierShape positon={"bottom"} color={"blue"} />
      <header className="start-page--header">Quizzical</header>
      <button className="start-page--btn" onClick={start}>
        Start quiz
      </button>
      <Footer />
    </div>,
    <div key={nanoid()} className="quiz-page">
      <BezierShape positon={"top"} color={"yellow"} />
      <BezierShape positon={"bottom"} color={"blue"} />
      {questionElements}
      <div className="quiz-page--footer">
        <button className="quiz-page--footer--btn" onClick={finish}>
          Check answers
        </button>
      </div>
      <Footer />
    </div>,
    <div key={nanoid()} className="quiz-page">
      <BezierShape positon={"bottom"} color={"blue"} />
      <BezierShape positon={"top"} color={"yellow"} />
      {questionElements}
      <div className="quiz-page--footer">
        <div className="quiz-page--footer--content">{`You scored ${counterCorrect}/5 correct answers`}</div>
        <button className="quiz-page--footer--btn" onClick={restart}>
          Play again
        </button>
      </div>
      <Footer />
    </div>,
  ];

  return pages[state];
}
