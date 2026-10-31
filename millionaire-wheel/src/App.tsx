import { useState } from 'react';
import './App.css';

// Base reward options for all segments
const BASE_PRIZES = [
  "1 triệu đồng",
  "2 triệu đồng",
  "500k",
  "5 triệu đồng",
  "3 triệu đồng",
  "10 triệu đồng"
];

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#FFE66D",
  "#1A535C",
  "#F7FFF7",
  "#FF9F1C"
];

export default function App() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [landedIndex, setLandedIndex] = useState(null);
  const [showRealGifts, setShowRealGifts] = useState(false);

  // Dynamic array storing actual slice contents
  const [wheelPrizes, setWheelPrizes] = useState(BASE_PRIZES);

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);
    setLandedIndex(null);
    setShowRealGifts(false); // Reset to mystery "?" state during spin

    // Pick a random index for visual spin stopping
    const randomIndex = Math.floor(Math.random() * BASE_PRIZES.length);
    const sliceAngle = 360 / BASE_PRIZES.length;

    // Calculate rotation to land pointer cleanly inside the chosen slice
    const sliceCenter = randomIndex * sliceAngle + sliceAngle / 2;
    const targetAngleFromTop = 360 - sliceCenter;

    const extraSpins = (5 + Math.floor(Math.random() * 4)) * 360;
    const currentRotations = Math.floor(rotation / 360) * 360;
    const nextRotation = currentRotations + extraSpins + targetAngleFromTop;

    setRotation(nextRotation);

    setTimeout(() => {
      setSpinning(false);
      setLandedIndex(randomIndex);
      setResult("Cái nịt");

      // TROLL MECHANIC: Set ONLY the landed segment to "Cái nịt"
      setWheelPrizes(() => {
        const updatedPrizes = [...BASE_PRIZES];
        updatedPrizes[randomIndex] = "Cái nịt";
        return updatedPrizes;
      });
    }, 4000);
  };

  const toggleShowGifts = () => {
    if (spinning || !result) return;
    setShowRealGifts((prev) => !prev);
  };

  return (
    <div className="wheel-container">
      <h1>Vòng Quay Bí Ẩn 🎁</h1>

      <div className="wheel-wrapper">
        {/* Top Pointer */}
        <div className="pointer" />

        {/* SVG Wheel */}
        <svg
          className="wheel-svg"
          viewBox="0 0 500 500"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 4s cubic-bezier(0.15, 0.99, 0.35, 1)" : "none"
          }}
        >
          {wheelPrizes.map((prizeText, index) => {
            const angle = 360 / wheelPrizes.length;
            const startAngle = index * angle;
            const endAngle = (index + 1) * angle;

            const x1 = 250 + 240 * Math.cos((Math.PI * (startAngle - 90)) / 180);
            const y1 = 250 + 240 * Math.sin((Math.PI * (startAngle - 90)) / 180);
            const x2 = 250 + 240 * Math.cos((Math.PI * (endAngle - 90)) / 180);
            const y2 = 250 + 240 * Math.sin((Math.PI * (endAngle - 90)) / 180);

            const pathData = `M 250 250 L ${x1} ${y1} A 240 240 0 0 1 ${x2} ${y2} Z`;
            const textAngle = startAngle + angle / 2;

            // DISPLAY LOGIC:
            // 1. If admin reveals all: show all prize text ("Cái nịt" at landed index, real prizes elsewhere)
            // 2. If wheel finished spinning and this is the landed index: reveal "Cái nịt" immediately on wheel
            // 3. Otherwise: show "?"
            let displayText = "?";
            if (showRealGifts) {
              displayText = prizeText;
            } else if (index === landedIndex) {
              displayText = "Cái nịt";
            }

            return (
              <g key={index}>
                <path d={pathData} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth="3" />
                <text
                  x="250"
                  y="90"
                  fill="#111"
                  fontSize={displayText === "?" ? "32" : "16"}
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

        {/* Spin Center Button */}
        <button className="spin-center-btn" onClick={spinWheel} disabled={spinning}>
          {spinning ? "..." : "QUAY"}
        </button>
      </div>

      {/* Result Display */}
      {result && (
        <div className="result-card">
          🤣 Kết quả: <span className="troll-result">{result}</span>!
        </div>
      )}

      {/* Reveal Button (Disabled while spinning or before first spin) */}
      <div className="reveal-panel">
        <button 
          className="reveal-btn" 
          onClick={toggleShowGifts} 
          disabled={spinning || !result}
          style={{ opacity: spinning || !result ? 0.5 : 1, cursor: spinning || !result ? 'not-allowed' : 'pointer' }}
        >
          {showRealGifts ? "🙈 Cất quà (Hiện lại ?)" : "👁️ Hiện tất cả quà thực"}
        </button>
      </div>
    </div>
  );
}