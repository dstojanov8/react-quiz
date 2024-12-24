import { useReducer, useEffect, createContext, useContext } from "react";

const BASE_URL = "http://localhost:8123";
const SECS_PER_QUESTION = 30;

const QuizContext = createContext();

const initialState = {
  questions: [],
  status: "loading", // 'loading', 'error', 'ready', 'active', 'finished'
  index: 0, // index of questions we are currently at
  answer: null, // index of selected answer
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "startQuiz":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "resetQuiz":
      // return { ...state, status: "ready", index: 0, answer: null, points: 0, secondsRemaining: 10, };
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
        highscore: state.highscore,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("action unknown");
  }
};

const QuizProvider = ({ children }) => {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  const startQuiz = () => {
    dispatch({ type: "startQuiz" });
  };

  const newAnswer = (answerIndex) => {
    dispatch({ type: "newAnswer", payload: answerIndex });
  };

  const resetQuiz = () => {
    dispatch({ type: "resetQuiz" });
  };

  const tick = () => {
    dispatch({ type: "tick" });
  };

  const nextQuestion = () => {
    dispatch({ type: "nextQuestion" });
  };

  const finishQuiz = () => {
    dispatch({ type: "finish" });
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${BASE_URL}/questions`);
        const data = await response.json();
        dispatch({ type: "dataReceived", payload: data });
      } catch (err) {
        console.log(err.message);
        dispatch({ type: "dataFailed" });
      }
    };
    fetchQuestions();
  }, []);

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        numQuestions,
        maxPossiblePoints,
        startQuiz,
        newAnswer,
        resetQuiz,
        nextQuestion,
        finishQuiz,
        tick,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("QuizContext must be used within a QuizProvider");
  return context;
};

export { QuizProvider, useQuiz };
