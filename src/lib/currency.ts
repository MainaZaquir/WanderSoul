/**
 * Currency utility functions for Kenyan Shillings (KES/KSh)
 */

export const CURRENCY_SYMBOL = 'KSh';
export const CURRENCY_CODE = 'KES';

/**
 * Format a number as Kenyan Shillings
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string (e.g., "KSh 1,500")
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  options: {
    showSymbol?: boolean;
    showDecimals?: boolean;
    compact?: boolean;
  } = {}
): string {
  if (amount === null || amount === undefined) {
    return 'Price to be announced';
  }

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return 'Price to be announced';
  }

  const { showSymbol = true, showDecimals = false, compact = false } = options;

  let formatted: string;

  if (compact && numAmount >= 1000) {
    // For large amounts, show in thousands (e.g., "KSh 1.5K")
    const thousands = numAmount / 1000;
    formatted = thousands.toFixed(thousands % 1 === 0 ? 0 : 1) + 'K';
  } else {
    // Standard formatting
    formatted = numAmount.toLocaleString('en-KE', {
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    });
  }

  return showSymbol ? `${CURRENCY_SYMBOL} ${formatted}` : formatted;
}

/**
 * Format currency for display in price tags
 * @param amount - The amount to format
 * @returns Formatted string (e.g., "KSh 1,500")
 */
export function formatPrice(amount: number | string | null | undefined): string {
  return formatCurrency(amount, { showSymbol: true, showDecimals: false });
}

/**
 * Format currency for payment displays
 * @param amount - The amount to format
 * @returns Formatted string with decimals (e.g., "KSh 1,500.00")
 */
export function formatPaymentAmount(amount: number | string | null | undefined): string {
  return formatCurrency(amount, { showSymbol: true, showDecimals: true });
}

