const STATUS_CONFIG = {
  draft: { label: 'Draft', bg: 'bg-raised', text: 'text-text-secondary' },
  parsed: { label: 'Parsed', bg: 'bg-blue-50', text: 'text-blue-800' },
  running: { label: 'Running', bg: 'bg-amber-50', text: 'text-amber-700' },
  complete: { label: 'Complete', bg: 'bg-teal-50', text: 'text-teal-800' },
  error: { label: 'Error', bg: 'bg-red-50', text: 'text-red-700' },
};

export default function StatusPill({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      {status === 'running' && (
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
      )}
      {cfg.label}
    </span>
  );
}
