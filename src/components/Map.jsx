import React, { useEffect, useState, useRef, useCallback } from "react";
import USAMap from "react-usa-map";
import statesJson from "../states.json";
import { highwayGroup } from "../util/highwayGroup";

import Button from "@mui/material/Button";

// http://www.worldlicenseplates.com/usa/US_USAX.html

export default function Map() {
  const states = statesJson.data;
  const defaultCondition = {
    ongoing: false,
    correctCnt: 0,
    falseCnt: 0,
    failed: false
  };
  const [condition, setCondition] = useState(defaultCondition);
  const [quizArray, setQuizArray] = useState(states);
  const [msg, setMsg] = useState("");
  const [qAbbreviation, setqAbbreviation] = useState(null);
  const [colorMap, setColorMap] = useState({});
  const [progNum, setProgNum] = useState(0);
  const [count, setCount] = useState(0);

  const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const intervalRef = useRef(null);
  const startCount = useCallback(() => {
    if (intervalRef.current !== null) {
      return;
    }
    intervalRef.current = setInterval(() => {
      setCount((c) => c + 0.1);
    }, 100);
  }, []);
  const stopCount = useCallback(() => {
    if (intervalRef.current === null) {
      return;
    }
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);
  // useEffect(() => {
  //   setQuizArray((quizArray) => shuffle(quizArray));
  // }, []);

  useEffect(() => {
    setqAbbreviation(quizArray[progNum].attributes.abbreviation);
  }, [quizArray, progNum]);

  // 1回目は緑、2回目以降は黄色にする, 正解したかを返す
  const fillWhenCorrect = (guess, failed) => {
    let fillColor = "#2ECC71";
    if (failed) fillColor = "#F4D03F";

    let correct = false;
    let newColorMap = colorMap;

    highwayGroup.forEach((group) => {
      if (group.includes(guess)) {
        if (group.includes(qAbbreviation)) {
          correct = true;
          group.forEach((st) => {
            newColorMap[st] = { fill: fillColor };
          });
        }
      }
    });

    if (!correct) {
      if (guess === qAbbreviation) {
        correct = true;
        newColorMap[guess] = { fill: fillColor };
      }
    }
    setColorMap(newColorMap);

    return correct;
  };

  const startSession = () => {
    stopCount();
    setCount(0);
    setMsg("");
    setColorMap({});
    setProgNum(0);
    setCondition({ ...defaultCondition, ongoing: true });
    startCount();
  };

  const resetSession = () => {
    stopCount();
    setCount(0);
    setMsg("");
    setColorMap({});
    setProgNum(0);
    setCondition({ defaultCondition });
    setQuizArray((quizArray) => shuffle(quizArray));
  };

  const endSession = () => {
    stopCount();
    setCondition((condition) => ({
      ...condition,
      ongoing: false,
      failed: false
    }));
    setQuizArray((quizArray) => shuffle(quizArray));
  };

  const goNextOrEnd = () => {
    let nextProgNum = progNum + 1;
    if (nextProgNum === 50) {
      nextProgNum = 0;
      endSession();
    }
    setProgNum(nextProgNum);
  };

  const onMapClick = (e) => {
    const { ongoing, correctCnt, falseCnt, failed } = condition;
    if (!ongoing) return;

    const guessAbbreviation = e.target.dataset.name;
    if (fillWhenCorrect(guessAbbreviation, failed)) {
      setMsg(`It was ${quizArray[progNum].attributes.name}`);

      if (failed) setCondition({ ...condition, failed: false });
      else {
        setCondition({
          ...condition,
          correctCnt: correctCnt + 1
        });
      }
      goNextOrEnd();
    } else {
      setMsg(`${guessAbbreviation} Not Correct!`);
      if (!failed) {
        setCondition({ ...condition, falseCnt: falseCnt + 1, failed: true });
      }
    }
  };

  const onSkip = () => {
    if (condition.ongoing) {
      fillWhenCorrect(qAbbreviation, true);
      const tmsg = `It was ${quizArray[progNum].attributes.name}`;
      setMsg(tmsg);
      const newFalseCnt = condition.falseCnt + 1;
      setCondition((condition) => ({
        ...condition,
        falseCnt: newFalseCnt,
        failed: false
      }));
      goNextOrEnd();
    }
  };

  return (
    <div>
      {condition.ongoing && qAbbreviation ? (
        <div>
          <img src={`/images/highway/${qAbbreviation}.PNG`} alt="quizImage" />
          <img
            src={`/images/license-plate/${qAbbreviation}.PNG`}
            alt="quizImage"
            className="blur"
          />
        </div>
      ) : (
        "waiting to start"
      )}
      {condition.ongoing ? (
        <Button onClick={resetSession}>Reset</Button>
      ) : (
        <Button onClick={startSession}>Start</Button>
      )}
      {condition.ongoing ? <Button onClick={onSkip}>Skip</Button> : ""}
      {msg}
      <USAMap customize={colorMap} onClick={onMapClick} />
      <br></br>
      {`Correct: ${condition.correctCnt}`}
      {`Missed: ${condition.falseCnt}`}
      {`Time: ${count.toFixed(1)} s`}
    </div>
  );
}
