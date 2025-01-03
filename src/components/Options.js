import { useQuiz } from "../contexts/QuizContext";

const Options = ({ question }) => {
  const { answer, newAnswer } = useQuiz();

  const hasAnswered = answer !== null;

  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          disabled={hasAnswered}
          key={option}
          // If index of rendered option is the same as selected (answer) then apply css
          // Second check is to see if index is the same as correct answer from question
          className={`btn btn-option ${index === answer ? "answer" : ""} ${
            hasAnswered
              ? index === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          onClick={() => newAnswer(index)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default Options;
