export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-raised flex items-center justify-center mb-4">
        <svg
          className="w-5 h-5 text-text-tertiary"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="10" cy="10" r="7" />
          <path d="M10 7v4M10 13h.01" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="font-display font-medium text-text-primary mb-1">
        {title}
      </h3>
      <p className="text-sm text-text-secondary max-w-xs mb-5">{description}</p>
      {action && (
        <div className="flex items-center gap-2 text-sm text-brand-teal font-medium hover:underline cursor-pointer">
          {action}
        </div>
      )}
    </div>
  );
}
