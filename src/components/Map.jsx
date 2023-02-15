import React, { useEffect, useState } from "react";
import USAMap from "react-usa-map";
import statesJson from "../states.json";
import { highwayGroup } from "../util/highwayGroup";

import Button from "@mui/material/Button";

export default function Map() {
  const states = statesJson.data;
  const [condition, setCondition] = useState({
    ongoing: false,
    end: false,
    correctCnt: 0,
    falseCnt: 0,
    failed: false,
    quizMode: null
  });
  const [quizArray, setQuizArray] = useState(states);
  const [msg, setMsg] = useState("");
  const [qAbbreviation, setqAbbreviation] = useState(null);
  const [aAbbreviation, setaAbbreviation] = useState(null);
  const [colorMap, setColorMap] = useState({});
  const [progNum, setProgNum] = useState(0);

  const shuffle = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    setQuizArray((quizArray) => shuffle(quizArray));
    console.log("shuffled");
  }, [condition.end]);

  useEffect(() => {
    setqAbbreviation(quizArray[progNum].attributes.abbreviation);
  }, [quizArray, progNum]);

  // 1回目は緑、2回目以降は黄色にする
  const fillWhenCorrect = (guess, failed) => {
    let fillColor = "#2ECC71";
    if (failed) fillColor = "#F4D03F";
    let filled = false;
    highwayGroup.forEach((group) => {
      if (group.includes(guess)) {
        if (group.includes(qAbbreviation)) {
          filled = true;
          const newColorMap = colorMap;
          group.forEach((st) => {
            newColorMap[st] = { fill: fillColor };
          });
          setColorMap(newColorMap);
        }
      }
    });

    if (!filled) {
      if (guess === qAbbreviation) {
        filled = true;
        const newColorMap = colorMap;
        newColorMap[guess] = { fill: fillColor };
        setColorMap(newColorMap);
      }
    }
    return filled;
  };

  const endQuiz = () => {
    // TODO end task
  };
  const goNextOrEnd = () => {
    let nextProgNum = progNum + 1;
    if (nextProgNum === 50) {
      nextProgNum = 0;
      endQuiz();
    }
    setProgNum(nextProgNum);
  };

  const mapHandler = (e) => {
    const { ongoing, end, correctCnt, falseCnt, failed } = condition;
    if (end) return;
    if (ongoing) {
      const guessAbbreviation = e.target.dataset.name;
      setaAbbreviation(guessAbbreviation);
      if (fillWhenCorrect(guessAbbreviation, failed)) {
        setMsg("You Got It Right!");
        goNextOrEnd();
        if (failed) setCondition({ ...condition, failed: false });
        else {
          setCondition({
            ...condition,
            correctCnt: correctCnt + 1
          });
        }
      } else {
        setMsg(`Not Correct! That State Uses This Sign. Try Again.`);
        if (!failed) {
          setCondition({ ...condition, falseCnt: falseCnt + 1, failed: true });
        }
      }
    }
  };
  const onSkip = () => {
    if (condition.ongoing) {
      fillWhenCorrect(qAbbreviation, true);
      const tmsg = `The answer was ${quizArray[progNum].attributes.name}`;
      setMsg(tmsg);
      setaAbbreviation(qAbbreviation);
      const newFalseCnt = condition.falseCnt + 1;
      setCondition({ ...condition, falseCnt: newFalseCnt, failed: false });
      goNextOrEnd();
    }
  };

  const startSession = () => {
    setCondition({ ...condition, ongoing: true, progNum: 0, end: false });
  };

  return (
    <div>
      <h1>react-map-usa</h1>
      <USAMap customize={colorMap} onClick={mapHandler} />
      <br></br>
      {condition.ongoing && qAbbreviation ? (
        <img src={`/images/highway/${qAbbreviation}.PNG`} alt="quizImage" />
      ) : (
        "waiting to start"
      )}
      <br></br>
      {msg}
      {condition.ongoing && aAbbreviation ? (
        <img src={`/images/highway/${aAbbreviation}.PNG`} alt="quizImage" />
      ) : (
        ""
      )}
      <br></br>
      {`Correct: ${condition.correctCnt}`}
      {`Missed: ${condition.falseCnt}`}
      <br></br>
      <Button onClick={startSession}>Start</Button>
      <Button onClick={onSkip}>Skip</Button>
    </div>
  );
}
