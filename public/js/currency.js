// ============================================
// URBANBUNK — Client-side Currency Conversion
// ============================================

const CURRENCIES = {
  INR: { symbol: '₹', rate: 1, name: 'Indian Rupee', locale: 'en-IN' },
  USD: { symbol: '$', rate: 0.012, name: 'US Dollar', locale: 'en-US' },
  EUR: { symbol: '€', rate: 0.011, name: 'Euro', locale: 'de-DE' },
  GBP: { symbol: '£', rate: 0.0095, name: 'British Pound', locale: 'en-GB' },
  JPY: { symbol: '¥', rate: 1.78, name: 'Japanese Yen', locale: 'ja-JP' }
};

function formatPrice(amount, currency) {
  const c = CURRENCIES[currency] || CURRENCIES.INR;
  const converted = Math.round(amount * c.rate);
  return c.symbol + converted.toLocaleString(c.locale);
}

function applyCurrency(currency) {
  if (!currency) currency = localStorage.getItem('ub_currency') || 'INR';
  const c = CURRENCIES[currency];
  if (!c) return;

  document.querySelectorAll('[data-price]').forEach(el => {
    const inrPrice = parseFloat(el.getAttribute('data-price'));
    if (isNaN(inrPrice)) return;
    const converted = Math.round(inrPrice * c.rate);
    const formatted = c.symbol + converted.toLocaleString(c.locale);
    
    // Check if element has a /night suffix
    const suffix = el.getAttribute('data-price-suffix') || '';
    if (suffix) {
      el.innerHTML = formatted + '<span>' + suffix + '</span>';
    } else {
      el.textContent = formatted;
    }
  });

  localStorage.setItem('ub_currency', currency);

  // Update currency selectors
  document.querySelectorAll('#currencySelect, #settingsCurrency').forEach(sel => {
    if (sel) sel.value = currency;
  });
}

// Initialize currency on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedCurrency = localStorage.getItem('ub_currency') || 'INR';
  if (savedCurrency !== 'INR') {
    applyCurrency(savedCurrency);
  }
});
