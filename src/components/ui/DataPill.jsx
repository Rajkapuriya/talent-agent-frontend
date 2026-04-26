/**
 * Shows a compact data summary beneath a stage status row.
 * Renders differently depending on which stage produced the data.
 */
export default function DataPill({ data }) {
  if (!data) return null;

  const pills = [];

  if (data.parseQuality != null) {
    pills.push(`Quality: ${Math.round(data.parseQuality * 100)}%`);
  }
  if (data.skills?.length) {
    pills.push(`${data.skills.length} skills extracted`);
  }
  if (data.count != null) {
    pills.push(`${data.count} candidates found`);
  }
  if (data.matchScore != null) {
    pills.push(`Match: ${Math.round(data.matchScore)}`);
  }
  if (data.interestScore != null) {
    pills.push(`Interest: ${Math.round(data.interestScore)}`);
  }
  if (data.tierCounts) {
    const t1 = data.tierCounts.tier1 ?? 0;
    const t2 = data.tierCounts.tier2 ?? 0;
    pills.push(`${t1} priority · ${t2} warm`);
  }

  if (!pills.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {pills.map((p) => (
        <span
          key={p}
          className="text-xs bg-white border border-border px-2 py-0.5 rounded font-mono text-text-secondary"
        >
          {p}
        </span>
      ))}
    </div>
  );
}
