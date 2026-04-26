const TIER_CONFIG = {
  tier1: { label: 'Priority', bg: '#E1F5EE', text: '#085041' },
  tier2: { label: 'Warm', bg: '#FAEEDA', text: '#633806' },
  tier3: { label: 'Passive', bg: '#F1EFE8', text: '#444441' },
  archive: { label: 'Archive', bg: '#F7C1C1', text: '#791F1F' },
};

export default function TierBadge({ tier }) {
  const config = TIER_CONFIG[tier] ?? TIER_CONFIG.archive;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ background: config.bg, color: config.text }}
    >
      {config.label}
    </span>
  );
}
