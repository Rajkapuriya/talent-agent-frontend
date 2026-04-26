import { scoreColorHex } from '../../utils/scoreColor';

/**
 * Horizontal progress bar for a single match score dimension.
 */
export default function ScoreDimension({ label, value }) {
  const pct = Math.round((value ?? 0) * 100);
  const color = scoreColorHex(pct);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-text-secondary">{label}</span>
        <span className="text-xs font-mono font-medium" style={{ color }}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 bg-raised rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
