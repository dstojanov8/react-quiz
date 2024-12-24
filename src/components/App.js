// import { useEffect, useReducer } from "react";

import Loader from "./Loader";
import Question from "./Question";
import Error from "./Error";
import Header from "./Header";
import Main from "./Main";
import StartScreen from "./StartScreen";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import { useQuiz } from "../contexts/QuizContext";

// const SECS_PER_QUESTION = 30;

//* Section 16: 200 Lecture (ideas for more features to implement)

//* All the logic is now in QuizContext.js, if you want old version check src-no-context folder

const App = () => {
  const { status } = useQuiz();

  return (
    <div className="app">
      <Header />

      <Main className="main">
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen />}
        {status === "active" && (
          <>
            <Progress />
            <Question />
            <Footer>
              <Timer />
              <NextButton />
            </Footer>
          </>
        )}
        {status === "finished" && <FinishScreen />}
      </Main>
    </div>
  );
};

export default App;
