export const formatDH = (amount: number): string => {
  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " DH";
};

export const getMonthName = (date: Date): string => {
  return date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
};
