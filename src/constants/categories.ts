import { Category } from '../types';

export const THEME = {
  colors: {
    primary: '#006233',    // Vert Drapeau
    secondary: '#C1272D',  // Rouge Drapeau
    background: '#F7F9FC',
    text: '#1A1A1A',
    subtext: '#8F9BB3',
    card: '#FFFFFF',
    success: '#00D68F',
    danger: '#FF3D71',
    income: '#27AE60',     // Vert pour les revenus
    expense: '#E74C3C',    // Rouge pour les dépenses
  }
};

// On sépare clairement les catégories
export const EXPENSE_CATEGORIES: Category[] = [
  { id: '1', name: 'Nourriture & Marché', icon: 'ShoppingCart', color: '#FF6B6B' },
  { id: '2', name: 'Loyer & Maison', icon: 'Home', color: '#4ECDC4' },
  { id: '3', name: 'Eau / Élec / Gaz', icon: 'Zap', color: '#FFE66D' },
  { id: '4', name: 'Transport / Diesel', icon: 'Car', color: '#1A535C' },
  { id: '5', name: 'Enfants & École', icon: 'GraduationCap', color: '#FF9F1C' },
  { id: '6', name: 'Santé & Hammam', icon: 'Heart', color: '#FF006E' },
  { id: '7', name: 'Fêtes & Cadeaux', icon: 'Gift', color: '#8338EC' },
  { id: '8', name: 'Provisions (Stock)', icon: 'Database', color: '#FB5607' },
  { id: '9', name: 'Café & Resto', icon: 'Coffee', color: '#3A86FF' },
  { id: '10', name: 'Famille & Parents', icon: 'Users', color: '#9D4EDD' },
  { id: '11', name: 'Vêtements', icon: 'ShoppingBag', color: '#FF00CC' }, // Ajouté
];

export const INCOME_CATEGORIES: Category[] = [
  { id: '100', name: 'Salaire', icon: 'Banknote', color: '#27AE60' },
  { id: '101', name: 'Prime / Bonus', icon: 'TrendingUp', color: '#2ECC71' },
  { id: '102', name: 'Vente / Commerce', icon: 'ShoppingBag', color: '#16A085' },
  { id: '103', name: 'Cadeau reçu', icon: 'Gift', color: '#3498DB' },
  { id: '104', name: 'Autre Revenu', icon: 'PlusCircle', color: '#95A5A6' },
];

// Pour la compatibilité, on exporte une liste globale par défaut (Dépenses surtout)
export const DEFAULT_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];