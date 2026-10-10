"use client";

import { useEffect, useState } from "react";

const HEADLINE = "Never lose a receipt again.";

export function TypewriterHeadline({ className }: { className?: string }) {
  const [showCursor, setShowCursor] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [cursorFading, setCursorFading] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    setShowCursor(true);

    const blinkInterval = window.setInterval(() => {
      setCursorVisible((current) => !current);
    }, 530);

    const fadeTimer = window.setTimeout(() => {
      setCursorFading(true);
    }, 1600);

    const hideTimer = window.setTimeout(() => {
      setShowCursor(false);
      window.clearInterval(blinkInterval);
    }, 2200);

    return () => {
      window.clearInterval(blinkInterval);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <h1 className={className}>
      {HEADLINE}
      {showCursor ? (
        <span
          aria-hidden="true"
          className={`ml-px inline-block w-[2px] bg-primary align-baseline transition-opacity duration-300 ${
            cursorFading || !cursorVisible ? "opacity-0" : "opacity-100"
          }`}
          style={{ height: "1em" }}
        />
      ) : null}
    </h1>
  );
}
