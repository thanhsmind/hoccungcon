import React from "react";
import { TextBlock } from "./TextBlock.jsx";
import { CalculatorBlock } from "./CalculatorBlock.jsx";
import { RevealBlock } from "./RevealBlock.jsx";
import { RealLifeBlock } from "./RealLifeBlock.jsx";
import { WhyBlock } from "./WhyBlock.jsx";
import { NumberLineBlock } from "./NumberLineBlock.jsx";
import { FillInBlock } from "./FillInBlock.jsx";
import { DecimalBlock } from "./DecimalBlock.jsx";
import { AnglesBlock } from "./AnglesBlock.jsx";
import { QuizBlock } from "./QuizBlock.jsx";

export function renderBlock(s, award) {
  switch (s.type) {
    case "text": return <TextBlock s={s} />;
    case "calculator": return <CalculatorBlock s={s} award={award} />;
    case "reveal": return <RevealBlock s={s} award={award} />;
    case "reallife": return <RealLifeBlock s={s} award={award} />;
    case "why": return <WhyBlock s={s} award={award} />;
    case "numberline": return <NumberLineBlock s={s} award={award} />;
    case "fillin": return <FillInBlock s={s} award={award} />;
    case "decimal": return <DecimalBlock s={s} award={award} />;
    case "geometry": return <AnglesBlock s={s} award={award} />;
    case "quiz": return <QuizBlock s={s} award={award} />;
    default: return null;
  }
}
