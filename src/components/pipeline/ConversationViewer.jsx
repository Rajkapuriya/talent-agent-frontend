export default function ConversationViewer({ transcript }) {
  if (!transcript.length)
    return (
      <p className="text-sm text-text-tertiary">No conversation recorded.</p>
    );

  const SIGNAL_COLORS = {
    positive: 'text-brand-teal',
    negative: 'text-red-600',
    neutral: 'text-text-tertiary',
    ambiguous: 'text-amber-600',
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
      {transcript.map((turn, i) => (
        <div
          key={i}
          className={`flex gap-3 ${turn.role === 'recruiter' ? '' : 'flex-row-reverse'}`}
        >
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0
            ${turn.role === 'recruiter' ? 'bg-sidebar text-white' : 'bg-surface border border-border text-text-secondary'}`}
          >
            {turn.role === 'recruiter' ? 'R' : 'C'}
          </div>
          <div
            className={`max-w-[80%] ${turn.role === 'recruiter' ? '' : 'items-end'}`}
          >
            <div
              className={`px-4 py-3 rounded-xl text-sm leading-relaxed
              ${
                turn.role === 'recruiter'
                  ? 'bg-surface border border-border text-text-primary rounded-tl-sm'
                  : 'bg-sidebar text-white rounded-tr-sm'
              }`}
            >
              {turn.content}
            </div>
            {turn.signalAnnotation && (
              <p
                className={`text-xs mt-1 ${SIGNAL_COLORS[turn.signalAnnotation.signalType]}`}
              >
                {turn.signalAnnotation.signalType} ·{' '}
                {turn.signalAnnotation.signalCategory} ·
                {Math.round(turn.signalAnnotation.confidence * 100)}% confidence
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
