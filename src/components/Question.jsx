import { nanoid } from "nanoid";

function Question({ state, question, handlePick }) {
  const states = {
    active: 0,
    disabled: 1,
  };

  const answerElements = question.answers.map((answer, index) => {
    let answerState = "";
    let handleClick = () => {};

    if (states.active === state) {
      answerState = "active";
      if (index === question.aIndexPicked) answerState = "picked";
      handleClick = () => handlePick(question.qIndex, index);
    } else {
      answerState = "disabled";
      if (index === question.aIndexPicked) answerState = "incorrect";
      if (index === question.aIndexCorrect) answerState = "correct";
      handleClick = () => {};
    }

    return (
      <div
        key={nanoid()}
        className={`quiz-page--question--answers--answer ${answerState}`}
        onClick={handleClick}
      >
        {decode(answer)}
      </div>
    );
  });

  return (
    <div
      className={`quiz-page--question ${
        question.isTrembling ? "trembling" : ""
      }`}
    >
      <header className="quiz-page--question--header">
        {decode(question.question)}
      </header>
      <div className="quiz-page--question--answers">{answerElements}</div>
    </div>
  );
}

function decode(string) {
  let ta = document.createElement("textarea");
  ta.innerHTML = string;
  return ta.value;
}

export default Question;
