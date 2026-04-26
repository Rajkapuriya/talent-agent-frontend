/**
 * Formats a date string or Date object as a human-readable string.
 * e.g. "12 Jan 2025"
 */
export function formatDate(date) {
    if (!date) return '—';
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
    }).format(new Date(date));
}

/**
 * Returns a relative time string.
 * e.g. "3 days ago", "just now"
 */
export function timeAgo(date) {
    if (!date) return '—';
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return formatDate(date);
}

/**
 * Capitalises the first letter of a string.
 */
export function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a score (0-100) to a display string with 0 decimal places.
 */
export function formatScore(score) {
    if (score == null) return '—';
    return Math.round(score).toString();
}

/**
 * Converts snake_case or kebab-case to Title Case.
 * "actively_looking" → "Actively Looking"
 */
export function toTitleCase(str) {
    if (!str) return '';
    return str.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}