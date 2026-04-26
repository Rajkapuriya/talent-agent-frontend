/**
 * Renders a skill pill.
 * variant: "default" | "gap" | "strength"
 */
export default function SkillTag({ label, variant = 'default' }) {
  const styles = {
    default: 'bg-raised text-text-secondary border-border',
    gap: 'bg-red-50 text-red-700 border-red-200',
    strength: 'bg-tier-1-bg text-tier-1-text border-transparent',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs rounded border font-mono
        ${styles[variant] ?? styles.default}`}
    >
      {label}
    </span>
  );
}
