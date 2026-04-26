export default function ScoreRing({ value, label, size = 48, accent = false }) {
  const r = size / 2 - 4;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = value >= 70 ? '#1D9E75' : value >= 45 ? '#BA7517' : '#A32D2D';

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#E4E2DE"
          strokeWidth={accent ? 3 : 2.5}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={accent ? 3 : 2.5}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <span
        className="absolute text-center"
        style={{ fontSize: size * 0.26, fontWeight: 600, color }}
      >
        {label ?? value}
      </span>
    </div>
  );
}
