import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { isSameMonth, subMonths } from 'date-fns';

export const useFinancials = (selectedDate: Date = new Date()) => {
  const { transactions, monthlyIncome, categories } = useStore();

  // Helper pour calculer les totaux d'un mois donné
  const calculateForDate = (date: Date) => {
    const monthTx = transactions.filter(t => isSameMonth(new Date(t.date), date));
    
    const expenses = monthTx
      .filter(t => t.type === 'EXPENSE')
      .reduce((acc, t) => acc + t.amount, 0);
      
    const extraIncome = monthTx
      .filter(t => t.type === 'INCOME')
      .reduce((acc, t) => acc + t.amount, 0);
    
    const totalIncome = monthlyIncome + extraIncome;
    const balance = totalIncome - expenses;

    return { expenses, totalIncome, balance };
  };

  const current = useMemo(() => calculateForDate(selectedDate), [transactions, selectedDate, monthlyIncome]);
  const previous = useMemo(() => calculateForDate(subMonths(selectedDate, 1)), [transactions, selectedDate, monthlyIncome]);

  // Calcul des variations (%)
  const getVariation = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  };

  const variations = {
    income: getVariation(current.totalIncome, previous.totalIncome),
    expenses: getVariation(current.expenses, previous.expenses)
  };

  // Taux d'épargne du mois sélectionné
  const savingsRate = current.totalIncome > 0 ? (current.balance / current.totalIncome) * 100 : 0;

  // Stats par catégorie pour le mois sélectionné
  const categoryStats = useMemo(() => {
    const map = new Map<string, number>();
    const monthTx = transactions.filter(t => isSameMonth(new Date(t.date), selectedDate));

    monthTx.filter(t => t.type === 'EXPENSE').forEach(t => {
      const currentAmount = map.get(t.categoryId) || 0;
      map.set(t.categoryId, currentAmount + t.amount);
    });

    return Array.from(map)
      .map(([catId, amount]) => {
        const cat = categories.find(c => c.id === catId);
        const limit = cat?.budgetLimit || 0;
        const isOverBudget = limit > 0 && amount > limit;

        return {
          id: catId,
          name: cat?.name || 'Autre',
          color: isOverBudget ? '#D32F2F' : (cat?.color || '#ccc'),
          amount,
          limit,
          isOverBudget,
          percent: current.expenses > 0 ? (amount / current.expenses) * 100 : 0
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, categories, current.expenses, selectedDate]);

  return { 
    ...current, 
    savings: current.balance, // <--- C'EST CETTE LIGNE QUI MANQUAIT
    previous, 
    variations, 
    savingsRate, 
    categoryStats 
  };
};