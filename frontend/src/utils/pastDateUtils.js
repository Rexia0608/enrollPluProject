// src/utils/dateUtils.js

/**
 * Checks if a given date string (YYYY-MM-DD) is a future date
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {boolean} - True if date is strictly after today
 */
export const isFutureDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // reset time to start of day
  return date > today;
};

/**
 * Returns tomorrow's date in YYYY-MM-DD format
 * @returns {string}
 */
export const getTomorrowDate = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};
