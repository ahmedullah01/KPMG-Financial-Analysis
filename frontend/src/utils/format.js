export const formatAccounting = (value) => {
  if (value === null || value === undefined || value === '') return '';
  
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.abs(num));
  
  return num < 0 ? `(${formatted})` : formatted;
};

// Formatter without decimals for KPIs
export const formatAccountingCompact = (value) => {
  if (value === null || value === undefined || value === '') return '';
  
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.abs(num));
  
  return num < 0 ? `(${formatted})` : formatted;
};
