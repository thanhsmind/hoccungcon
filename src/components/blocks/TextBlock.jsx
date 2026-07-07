import React from "react";
import { C } from "../../lib/colors.js";
import { RichText } from "../RichText.jsx";
import { Card } from "../ui/Card.jsx";
import { Figure } from "../Figure.jsx";

export function TextBlock({ s }) {
  const dark = s.variant === "definition";
  const note = s.variant === "note";
  return (
    <Card style={dark ? { background: C.ink, color: C.paper } : note ? { background: C.violet + "14", borderStyle: "dashed" } : {}}>
      {s.title2 && <div style={{ fontSize: 13, letterSpacing: 1, opacity: dark ? 0.7 : 1, fontWeight: 700, color: dark ? C.paper : C.coral }}>{s.title2}</div>}
      <p style={{ margin: s.title2 ? "8px 0 0" : 0, fontSize: dark ? 19 : 17, lineHeight: 1.55, fontFamily: dark ? "'Baloo 2'" : "inherit", fontWeight: dark ? 600 : 400 }}>
        <RichText content={s.body} />
      </p>
      {s.figure && <Figure spec={s.figure} />}
    </Card>
  );
}
