import { useState } from 'react';
import './App.css';
import Banner from './assets/rich-happy.gif';
import Laughter_1 from './assets/c5f285177a8615d53bd45bcb4ee3a154.jpg';
import Laughter_2 from './assets/e7b756706240d1021141d0aa9538e230.jpg';

// "Cái nịt" is now part of the base prizes array
const BASE_PRIZES = ["10k", "20k", "50k", "Cái nịt", "100k", "200k"];

const COLORS = [
  "#ffffff",
  "#4ECDC4",
  "#ffffff",
  "#4ECDC4",
  "#ffffff",
  "#4ECDC4",
];

export default function App() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [showRealGifts, setShowRealGifts] = useState(false);
  const [transitionStyle, setTransitionStyle] = useState("none");

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);
    setShowRealGifts(false);

    const numSlices = BASE_PRIZES.length;
    const sliceAngle = 360 / numSlices;

    // 1. Pick a completely random initial landing index
    const firstLandingIndex = Math.floor(Math.random() * numSlices);
    const sliceCenterOffset = sliceAngle / 2;
    const firstAngleFromTop = 360 - (firstLandingIndex * sliceAngle + sliceCenterOffset);

    const extraSpins = (5 + Math.floor(Math.random() * 3)) * 360;
    const currentBaseRotation = Math.floor(rotation / 360) * 360;
    const firstTargetRotation = currentBaseRotation + extraSpins + firstAngleFromTop;

    // --- PHASE 1: Normal Initial Spin ---
    setTransitionStyle("transform 6s cubic-bezier(0.15, 0.99, 0.35, 1)");
    setRotation(firstTargetRotation);

    // --- PHASE 2: Auto-correct/glide to "Cái nịt" after initial stop ---
    setTimeout(() => {
      // Find the exact index of "Cái nịt" in BASE_PRIZES
      const caiNitIndex = BASE_PRIZES.indexOf("Cái nịt");
      const caiNitAngleFromTop = 360 - (caiNitIndex * sliceAngle + sliceCenterOffset);

      // Calculate the shortest rotational path (clockwise vs counter-clockwise)
      const currentModRotation = firstTargetRotation % 360;
      let angleDifference = caiNitAngleFromTop - currentModRotation;

      // Normalize angle difference to be between -180 and 180 degrees for shortest turn
      while (angleDifference > 180) angleDifference -= 360;
      while (angleDifference < -180) angleDifference += 360;

      const finalRotation = firstTargetRotation + angleDifference;

      // Smooth transition for the correction glide
      setTransitionStyle("transform 1.8s cubic-bezier(0.25, 1, 0.5, 1)");
      setRotation(finalRotation);

      // Finalize outcome after correction animation finishes
      setTimeout(() => {
        setSpinning(false);
        setResult("Cái nịt");
      }, 1800);

    }, 6000);
  };

  const toggleShowGifts = () => {
    if (spinning || !result) return;
    setShowRealGifts((prev) => !prev);
  };

  return (
    <div className="wheel-container">
      <h1 className="title">Bạn có phải là Tư Sản?</h1>
      <h2 className="subtitle">(Hay là Vô Sản)</h2>

      <div className="main-content">
        {result ? (
          <img src={Laughter_1} alt="Laughter Left" className="outer-laughter spinning-forever" />
        ) : (
          <img src={Banner} alt="Rich Happy Left" className="side-banner" />
        )}

        <div className="wheel-wrapper">
          <div className="pointer" />

          <svg
            className="wheel-svg"
            viewBox="0 0 500 500"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: transitionStyle
            }}
          >
            {BASE_PRIZES.map((prizeText, index) => {
              const angle = 360 / BASE_PRIZES.length;
              const startAngle = index * angle;
              const endAngle = (index + 1) * angle;

              const x1 = 250 + 240 * Math.cos((Math.PI * (startAngle - 90)) / 180);
              const y1 = 250 + 240 * Math.sin((Math.PI * (startAngle - 90)) / 180);
              const x2 = 250 + 240 * Math.cos((Math.PI * (endAngle - 90)) / 180);
              const y2 = 250 + 240 * Math.sin((Math.PI * (endAngle - 90)) / 180);

              const pathData = `M 250 250 L ${x1} ${y1} A 240 240 0 0 1 ${x2} ${y2} Z`;
              const textAngle = startAngle + angle / 2;

              let displayText = prizeText;
              // If gifts are hidden and user hasn't toggled reveal yet, mask non-Cái nịt prizes with "?"
              if (!showRealGifts && prizeText !== "Cái nịt" && result) {
                displayText = "?";
              }

              return (
                <g key={index}>
                  <path d={pathData} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth="3" />
                  <text
                    x="250"
                    y="90"
                    fill="#111"
                    fontSize={displayText === "?" ? "32" : "22"}
                    fontWeight="bold"
                    textAnchor="middle"
                    transform={`rotate(${textAngle}, 250, 250)`}
                  >
                    {displayText}
                  </text>
                </g>
              );
            })}
          </svg>

          <button className="spin-center-btn" onClick={spinWheel} disabled={spinning}>
            {spinning ? "..." : "QUAY"}
          </button>
        </div>

        {result ? (
          <img src={Laughter_2} alt="Laughter Right" className="outer-laughter spinning-forever" />
        ) : (
          <img src={Banner} alt="Rich Happy Right" className="side-banner" />
        )}
      </div>

      {result && (
        <div className="result-card">
          Kết quả: <span className="troll-result">{result}</span> !
        </div>
      )}

      <div className="reveal-panel">
        <button
          className="reveal-btn"
          onClick={toggleShowGifts}
          disabled={spinning || !result}
          style={{ opacity: spinning || !result ? 0.5 : 1, cursor: spinning || !result ? 'not-allowed' : 'pointer' }}
        >
          {showRealGifts ? "Che tất cả quà" : "Hiện tất cả quà"}
        </button>
      </div>
    </div>
  );
}