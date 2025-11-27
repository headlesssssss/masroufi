import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Category, RecurringExpense } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import { isSameMonth } from 'date-fns';

interface StoreState {
  transactions: Transaction[];
  categories: Category[];
  recurringExpenses: RecurringExpense[];
  monthlyIncome: number;
  isDarkMode: boolean;

  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateCategory: (category: Category) => void;
  setMonthlyIncome: (amount: number) => void;
  toggleTheme: () => void;
  reset: () => void;

  addRecurringExpense: (expense: Omit<RecurringExpense, 'id'>) => void;
  updateRecurringExpense: (expense: RecurringExpense) => void; // <--- NOUVEAU
  deleteRecurringExpense: (id: string) => void;
  checkRecurringTransactions: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: DEFAULT_CATEGORIES,
      recurringExpenses: [],
      monthlyIncome: 0,
      isDarkMode: false,

      addTransaction: (transaction) => set((state) => ({
        transactions: [{ ...transaction, id: Date.now().toString() }, ...state.transactions]
      })),
      updateTransaction: (updatedTx) => set((state) => ({
        transactions: state.transactions.map((t) => t.id === updatedTx.id ? updatedTx : t)
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id)
      })),
      updateCategory: (updatedCat) => set((state) => ({
        categories: state.categories.map((c) => c.id === updatedCat.id ? updatedCat : c)
      })),
      setMonthlyIncome: (amount) => set({ monthlyIncome: amount }),
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      reset: () => set({ transactions: [], monthlyIncome: 0, categories: DEFAULT_CATEGORIES, recurringExpenses: [] }),

      addRecurringExpense: (expense) => set((state) => ({
        recurringExpenses: [...state.recurringExpenses, { ...expense, id: Date.now().toString() }]
      })),

      // --- NOUVELLE FONCTION DE MISE À JOUR ---
      updateRecurringExpense: (updatedExpense) => set((state) => ({
        recurringExpenses: state.recurringExpenses.map((e) => e.id === updatedExpense.id ? updatedExpense : e)
      })),

      deleteRecurringExpense: (id) => set((state) => ({
        recurringExpenses: state.recurringExpenses.filter(e => e.id !== id)
      })),

      checkRecurringTransactions: () => {
        const state = get();
        const today = new Date();
        const currentDay = today.getDate();
        
        let newTransactions: Transaction[] = [];
        let updatedRecurring: RecurringExpense[] = [];
        let hasChanges = false;

        state.recurringExpenses.forEach(expense => {
            const shouldBePaid = currentDay >= expense.dayOfMonth;
            const lastDate = expense.lastAppliedDate ? new Date(expense.lastAppliedDate) : null;
            const alreadyPaidThisMonth = lastDate ? isSameMonth(lastDate, today) : false;

            if (shouldBePaid && !alreadyPaidThisMonth) {
                const newTx: Transaction = {
                    id: Date.now().toString() + Math.random(),
                    amount: expense.amount,
                    categoryId: expense.categoryId,
                    date: today.toISOString(),
                    note: `[Auto] ${expense.name}`,
                    type: 'EXPENSE'
                };
                newTransactions.push(newTx);
                updatedRecurring.push({ ...expense, lastAppliedDate: today.toISOString() });
                hasChanges = true;
            } else {
                updatedRecurring.push(expense);
            }
        });

        if (hasChanges) {
            set((state) => ({
                transactions: [...newTransactions, ...state.transactions],
                recurringExpenses: updatedRecurring
            }));
        }
      }
    }),
    { name: 'masroufi-storage', storage: createJSONStorage(() => AsyncStorage) }
  )
);