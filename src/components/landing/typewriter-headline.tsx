"use client";

import { useEffect, useState } from "react";

const HEADLINE = "Never lose a receipt again.";

export function TypewriterHeadline({ className }: { className?: string }) {
  const [visibleText, setVisibleText] = useState("");
  const [showCursor, setShowCursor] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [cursorFading, setCursorFading] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setVisibleText(HEADLINE);
      setShowCursor(false);
      return;
    }

    setVisibleText("");
    setShowCursor(true);
    setCursorVisible(true);
    setCursorFading(false);

    let index = 0;
    let fadeTimer: number | undefined;
    let hideTimer: number | undefined;

    const typingInterval = window.setInterval(() => {
      index += 1;
      setVisibleText(HEADLINE.slice(0, index));

      if (index >= HEADLINE.length) {
        window.clearInterval(typingInterval);

        fadeTimer = window.setTimeout(() => {
          setCursorFading(true);
        }, 1000);

        hideTimer = window.setTimeout(() => {
          setShowCursor(false);
        }, 1300);
      }
    }, 40);

    const blinkInterval = window.setInterval(() => {
      setCursorVisible((current) => !current);
    }, 530);

    return () => {
      window.clearInterval(typingInterval);
      window.clearInterval(blinkInterval);
      if (fadeTimer) window.clearTimeout(fadeTimer);
      if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <h1 aria-label={HEADLINE} className={className}>
      <span className="sr-only">{HEADLINE}</span>
      <span aria-hidden="true">
        {visibleText}
        {showCursor ? (
          <span
            aria-hidden="true"
            className={`ml-px inline-block w-[2px] bg-primary align-baseline transition-opacity duration-300 ${
              cursorFading || !cursorVisible ? "opacity-0" : "opacity-100"
            }`}
            style={{ height: "1em" }}
          />
        ) : null}
      </span>
    </h1>
  );
}
