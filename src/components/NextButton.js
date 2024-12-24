import { useQuiz } from "../contexts/QuizContext";

const NextButton = () => {
  const { answer, index, numQuestions, nextQuestion, finishQuiz } = useQuiz();

  if (answer === null) return null;

  if (index < numQuestions - 1)
    return (
      <button className="btn btn-ui" onClick={nextQuestion}>
        Next
      </button>
    );

  if (index === numQuestions - 1)
    return (
      <button className="btn btn-ui" onClick={finishQuiz}>
        Finish
      </button>
    );
};

export default NextButton;
