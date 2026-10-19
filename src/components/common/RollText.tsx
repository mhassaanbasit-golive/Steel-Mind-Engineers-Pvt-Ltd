import React from "react";

export function RollText({ text }: { text: string }) {
  const chars = [...text];
  const row = (k: string) => (
    <span className={k} aria-hidden="true">
      {chars.map((c, i) => (
        <span key={i} style={{ ["--i" as any]: i }}>
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </span>
  );
  return (
    <span className="roll" aria-label={text}>
      {row("roll-a")}
      {row("roll-b")}
    </span>
  );
}
