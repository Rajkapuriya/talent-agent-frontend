/**
 * Renders a coloured initials avatar for a candidate.
 * Deterministically assigns a color based on the name.
 */
const COLORS = [
  { bg: '#E1F5EE', text: '#085041' },
  { bg: '#E6F1FB', text: '#0C447C' },
  { bg: '#FAEEDA', text: '#633806' },
  { bg: '#EEEDFE', text: '#3C3489' },
  { bg: '#FAECE7', text: '#712B13' },
];

export default function CandidateAvatar({ name, size = 36 }) {
  const initials = (name ?? 'CA')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  const color = COLORS[(name?.charCodeAt(0) ?? 0) % COLORS.length];

  return (
    <div
      className="rounded-full flex items-center justify-center text-xs font-semibold font-display shrink-0"
      style={{
        width: size,
        height: size,
        background: color.bg,
        color: color.text,
      }}
    >
      {initials}
    </div>
  );
}
