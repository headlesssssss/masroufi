// src/types/index.ts

export type TransactionType = 'EXPENSE' | 'INCOME';

export interface Category {
  id: string;
  name: string;
  icon: string; // Nom de l'icône Lucide
  color: string;
  isCustom?: boolean;
  budgetLimit?: number; // <--- C'est la seule ligne que nous ajoutons ici
}

export interface Transaction {
  id: string;
  amount: number;
  categoryId: string;
  date: string; // ISO String
  note?: string;
  type: TransactionType;
}

export interface MonthlyBudget {
  month: string; // "MM-YYYY"
  limit: number;
}

export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  dayOfMonth: number; // Le jour du prélèvement (ex: le 1, le 30...)
  lastAppliedDate?: string; // Pour savoir si on l'a déjà payée ce mois-ci
}