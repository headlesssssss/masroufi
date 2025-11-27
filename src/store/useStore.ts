import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Category } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/categories';

interface StoreState {
  transactions: Transaction[];
  categories: Category[];
  monthlyIncome: number;
  isDarkMode: boolean; // <--- NOUVEAU

  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateCategory: (category: Category) => void;
  setMonthlyIncome: (amount: number) => void;
  toggleTheme: () => void; // <--- NOUVEAU
  reset: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      transactions: [],
      categories: DEFAULT_CATEGORIES,
      monthlyIncome: 0,
      isDarkMode: false, // Par défaut en mode clair

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
      
      // Basculer le thème
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      reset: () => set({ transactions: [], monthlyIncome: 0, categories: DEFAULT_CATEGORIES }),
    }),
    { name: 'masroufi-storage', storage: createJSONStorage(() => AsyncStorage) }
  )
);