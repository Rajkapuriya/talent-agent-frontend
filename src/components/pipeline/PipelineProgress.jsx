/**
 * Overall pipeline progress bar with percentage and stage label.
 */
export default function PipelineProgress({
  completedStages,
  totalStages,
  currentLabel,
}) {
  const pct =
    totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm font-medium text-text-primary">
          {currentLabel ?? 'Initialising...'}
        </span>
        <span className="text-xs font-mono text-text-secondary">{pct}%</span>
      </div>
      <div className="h-1.5 bg-raised rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-teal rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-text-tertiary">
        {completedStages} of {totalStages} stages complete
      </p>
    </div>
  );
}
