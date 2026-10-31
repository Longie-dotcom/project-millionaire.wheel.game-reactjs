import { useState } from 'react';
import './App.css';
import Banner from './assets/rich-happy.gif';
import Laughter_1 from './assets/c5f285177a8615d53bd45bcb4ee3a154.jpg';
import Laughter_2 from './assets/e7b756706240d1021141d0aa9538e230.jpg';

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
  const [landedIndex, setLandedIndex] = useState<number | null>(null);
  const [showRealGifts, setShowRealGifts] = useState(false);

  // Dynamic array storing actual slice contents
  const [wheelPrizes, setWheelPrizes] = useState(BASE_PRIZES);

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);
    setResult(null);
    setLandedIndex(null);
    setShowRealGifts(false); // Reset to mystery "?" state during spin

    const numSlices = BASE_PRIZES.length;
    const sliceAngle = 360 / numSlices;

    // 1. Pick a random slice index
    const randomIndex = Math.floor(Math.random() * numSlices);

    // 2. Pick a random offset INSIDE that slice so it stops naturally without snapping
    const randomOffsetInsideSlice = Math.random() * (sliceAngle - 4) + 2; 
    const targetSliceStartAngle = randomIndex * sliceAngle;
    const exactStopAngleFromTop = targetSliceStartAngle + randomOffsetInsideSlice;
    const targetAngleFromTop = 360 - exactStopAngleFromTop;

    // 3. Add multiple full spins (5 to 8 full rotations)
    const extraSpins = (5 + Math.floor(Math.random() * 4)) * 360;
    const currentRotations = Math.floor(rotation / 360) * 360;
    const nextRotation = currentRotations + extraSpins + targetAngleFromTop;

    setRotation(nextRotation);

    // Match this timeout to your 8s CSS transition time (8000 ms)
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
    }, 8000);
  };

  const toggleShowGifts = () => {
    if (spinning || !result) return;
    setShowRealGifts((prev) => !prev);
  };

  return (
    <div className="wheel-container">
      <h1 className='title'>Bạn có phải là Tư Sản?</h1>
      <h2 className='subtitle'>(Hay là Vô Sản)</h2>

      {/* Main content layout */}
      <div className="main-content">
        {/* Left Side: Show Laughter when result exists, otherwise show Banner */}
        {result ? (
          <img src={Laughter_1} alt="Laughter Left" className="outer-laughter spinning-forever" />
        ) : (
          <img src={Banner} alt="Rich Happy Left" className="side-banner" />
        )}

        <div className="wheel-wrapper">
          {/* Top Pointer */}
          <div className="pointer" />

          {/* SVG Wheel */}
          <svg
            className="wheel-svg"
            viewBox="0 0 500 500"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? "transform 8s cubic-bezier(0.15, 0.99, 0.35, 1)" : "none"
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

          {/* Spin Center Button */}
          <button className="spin-center-btn" onClick={spinWheel} disabled={spinning}>
            {spinning ? "..." : "QUAY"}
          </button>
        </div>

        {/* Right Side: Show Laughter when result exists, otherwise show Banner */}
        {result ? (
          <img src={Laughter_2} alt="Laughter Right" className="outer-laughter spinning-forever" />
        ) : (
          <img src={Banner} alt="Rich Happy Right" className="side-banner" />
        )}
      </div>

      {/* Result Display */}
      {result && (
        <div className="result-card">
          Kết quả: <span className="troll-result">{result}</span> !
        </div>
      )}

      {/* Reveal Button */}
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