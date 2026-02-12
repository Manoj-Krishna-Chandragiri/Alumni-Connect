/**
 * Format a date string to relative time (e.g., "10 sec", "5 min", "2hr", "1 day", "2 months", "3 years")
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted relative time
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Invalid Date';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 0) return 'Just now';
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec`;
  }
  
  // Less than an hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min`;
  }
  
  // Less than a day
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}hr`;
  }
  
  // Less than a week
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return diffInDays === 1 ? '1 day' : `${diffInDays} days`;
  }
  
  // Less than a month (30 days)
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return diffInWeeks === 1 ? '1 week' : `${diffInWeeks} weeks`;
  }
  
  // Less than a year
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? '1 month' : `${diffInMonths} months`;
  }
  
  // Years
  const diffInYears = Math.floor(diffInMonths / 12);
  return diffInYears === 1 ? '1 year' : `${diffInYears} years`;
};

/**
 * Format a date string to a readable date (e.g., "January 10, 2026")
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Invalid Date';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format a date string to short date (e.g., "Jan 10, 2026")
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted short date
 */
export const formatShortDate = (dateString) => {
  if (!dateString) return 'Invalid Date';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
