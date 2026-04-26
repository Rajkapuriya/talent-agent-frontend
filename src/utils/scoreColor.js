/**
 * Returns a Tailwind text color class based on score value.
 * @param {number} score - 0 to 100
 * @returns {string}
 */
export function scoreColorClass(score) {
    if (score >= 70) return 'text-brand-teal';
    if (score >= 45) return 'text-brand-amber';
    return 'text-brand-red';
}

/**
 * Returns a hex color string for use in SVG/canvas.
 */
export function scoreColorHex(score) {
    if (score >= 70) return '#1D9E75';
    if (score >= 45) return '#BA7517';
    return '#A32D2D';
}

/**
 * Returns a background + text class pair for a score badge.
 */
export function scoreBadgeClasses(score) {
    if (score >= 70) return 'bg-tier-1-bg text-tier-1-text';
    if (score >= 45) return 'bg-tier-2-bg text-tier-2-text';
    return 'bg-red-100 text-red-800';
}