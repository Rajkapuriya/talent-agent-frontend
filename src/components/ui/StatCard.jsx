export default function StatCard({ label, value, accent }) {
  const accentClass =
    accent === 'teal'
      ? 'text-brand-teal'
      : accent === 'amber'
        ? 'text-brand-amber'
        : accent === 'red'
          ? 'text-brand-red'
          : 'text-text-primary';

  return (
    <div className="glass-card p-5">
      <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className={`text-3xl font-semibold font-display ${accentClass}`}>
        {value ?? 0}
      </p>
    </div>
  );
}
