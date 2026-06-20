export default function FranceVietnamMap() {
  return (
    <svg
      viewBox="0 0 400 280"
      className="mx-auto w-full max-w-md"
      aria-hidden="true"
    >
      {/* Simplified France outline */}
      <path
        d="M40 80 Q55 60 70 65 L85 55 Q95 50 100 60 L105 75 Q100 90 90 95 L75 100 Q60 105 50 95 Z"
        fill="none"
        stroke="#D4A843"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.7"
      />
      <text x="65" y="115" textAnchor="middle" fill="#D4A843" fontSize="11" fontFamily="serif" opacity="0.8">
        Paris
      </text>

      {/* Simplified Vietnam outline */}
      <path
        d="M280 60 Q295 55 305 70 L310 100 Q315 130 305 160 L295 200 Q285 230 275 240 L265 220 Q260 180 265 140 Q270 100 280 60 Z"
        fill="none"
        stroke="#D4A843"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.7"
      />
      <text x="290" y="255" textAnchor="middle" fill="#D4A843" fontSize="11" fontFamily="serif" opacity="0.8">
        Hà Nội
      </text>

      {/* Connection arc Paris → Hà Nội */}
      <path
        d="M100 75 Q200 20 280 75"
        fill="none"
        stroke="#D4A843"
        strokeWidth="1.5"
        strokeDasharray="6 4"
        className="animate-draw-line"
        style={{ strokeDasharray: 300, strokeDashoffset: 0 }}
      />

      {/* Route dots */}
      <circle cx="100" cy="75" r="4" fill="#D4A843" opacity="0.9" />
      <circle cx="200" cy="35" r="3" fill="#D4A843" opacity="0.5" />
      <circle cx="280" cy="75" r="4" fill="#C41E3A" opacity="0.9" />

      {/* Hoàn Kiếm lake hint */}
      <ellipse cx="290" cy="90" rx="8" ry="5" fill="none" stroke="#2E8B57" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}
