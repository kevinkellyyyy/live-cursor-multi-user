import { useRef, useCallback, useLayoutEffect, useMemo } from "react";
import { usePerfectCursor } from "../hooks/usePerfectCursors";

export function Cursor({ userName, point }) {
  const rCursor = useRef(null);

  // Generate a random color for this cursor
  const cursorColor = useMemo(() => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FECA57",
      "#FF9FF3",
      "#54A0FF",
      "#5F27CD",
      "#00D2D3",
      "#FF9F43",
      "#10AC84",
      "#EE5A24",
      "#0ABDE3",
      "#F79F1F",
      "#A3CB38",
      "#FDA7DF",
      "#D63031",
      "#74B9FF",
      "#A29BFE",
      "#6C5CE7",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []); // Empty dependency array so color is set once per component instance

  const animateCursor = useCallback((point) => {
    const elm = rCursor.current;
    if (!elm) return;
    elm.style.setProperty(
      "transform",
      `translate(${point[0] - 15}px, ${point[1] - 15}px)`
    );
  }, []);

  const onPointMove = usePerfectCursor(animateCursor);

  useLayoutEffect(() => onPointMove(point), [onPointMove, point]);

  return (
    <div
      ref={rCursor}
      style={{
        position: "absolute",
        top: 18,
        left: 18,
        width: 35,
        height: 35,
      }}
    >
      {userName && (
        <div
          style={{
            position: "absolute",
            top: -20,
            left: 20,
            background: cursorColor,
            color: "white",
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "12px",
            whiteSpace: "nowrap",
            fontFamily: "system-ui, sans-serif",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {userName}
        </div>
      )}
      <svg
        style={{
          position: "absolute",
          top: -15,
          left: -15,
          width: 35,
          height: 35,
        }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 35 35"
        fill="none"
        fillRule="evenodd"
      >
        <g fill="rgba(0,0,0,.2)" transform="translate(1,1)">
          <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
          <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
        </g>
        <g fill="white">
          <path d="m12 24.4219v-16.015l11.591 11.619h-6.781l-.411.124z" />
          <path d="m21.0845 25.0962-3.605 1.535-4.682-11.089 3.686-1.553z" />
        </g>
        <g fill={cursorColor}>
          <path d="m19.751 24.4155-1.844.774-3.1-7.374 1.841-.775z" />
          <path d="m13 10.814v11.188l2.969-2.866.428-.139h4.768z" />
        </g>
      </svg>
    </div>
  );
}
