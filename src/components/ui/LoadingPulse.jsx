/**
 * Full-page loading skeleton — used while async data loads.
 */
export default function LoadingPulse() {
  return (
    <div className="p-8 space-y-4 animate-pulse">
      <div className="h-8 w-48 bg-raised rounded" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-raised rounded-lg" />
        ))}
      </div>
      <div className="h-64 bg-raised rounded-lg" />
    </div>
  );
}

/**
 * Inline row skeleton — used inside tables while loading.
 */
export function LoadingRows({ count = 4 }) {
  return Array.from({ length: count }, (_, i) => (
    <tr key={i} className="animate-pulse border-b border-border">
      {[1, 2, 3, 4, 5].map((j) => (
        <td key={j} className="px-6 py-4">
          <div className="h-4 bg-raised rounded w-full" />
        </td>
      ))}
    </tr>
  ));
}
