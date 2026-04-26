import DataPill from '../ui/DataPill';
export default function StageStatus({
  label,
  description,
  status,
  data,
  index,
}) {
  const STATUS_CONFIG = {
    idle: { icon: '○', color: 'text-text-tertiary', bg: '' },
    loading: {
      icon: '◌',
      color: 'text-brand-amber',
      bg: 'bg-amber-50 border-amber-200',
    },
    done: {
      icon: '●',
      color: 'text-brand-teal',
      bg: 'bg-teal-50 border-teal-200',
    },
    error: { icon: '✕', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
  };

  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.idle;

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg border transition-all
      ${cfg.bg || 'bg-canvas border-border'}`}
    >
      <span
        className={`text-lg mt-0.5 shrink-0 ${cfg.color} ${status === 'loading' ? 'animate-spin' : ''}`}
      >
        {cfg.icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-text-tertiary">
            Stage {index}
          </span>
          <span className="font-medium text-sm">{label}</span>
        </div>
        <p className="text-xs text-text-secondary mt-0.5">{description}</p>
        {data && <DataPill data={data} />}
      </div>
    </div>
  );
}
