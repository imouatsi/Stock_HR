/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param locale - The locale to use for formatting (default: 'fr-DZ')
 * @param currency - The currency code (default: 'DZD')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  locale: string = 'fr-DZ',
  currency: string = 'DZD'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a date string
 * @param dateString - The date string to format
 * @param locale - The locale to use for formatting (default: 'fr-DZ')
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  locale: string = 'fr-DZ'
): string => {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get month name from month number
 * @param monthNumber - The month number (1-12)
 * @param locale - The locale to use (default: 'fr-DZ')
 * @returns Month name
 */
export const getMonthName = (
  monthNumber: number,
  locale: string = 'fr-DZ'
): string => {
  return new Date(2000, monthNumber - 1, 1).toLocaleDateString(locale, {
    month: 'long'
  });
};
