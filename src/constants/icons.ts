import { 
  ShoppingCart, Home, Zap, Car, GraduationCap, Heart, Gift, Database, 
  Coffee, Users, PiggyBank, Banknote, HelpCircle, ShoppingBag, TrendingUp, 
  PlusCircle, Smartphone, Wifi, Plane, Gamepad2, Dumbbell, Briefcase, 
  Utensils, Shirt, Music
} from 'lucide-react-native';

// 1. La Map utilisée pour l'affichage (String -> Composant)
export const ICON_MAP: Record<string, any> = {
  ShoppingCart, Home, Zap, Car, GraduationCap, Heart, Gift, Database, 
  Coffee, Users, PiggyBank, Banknote, HelpCircle, ShoppingBag, TrendingUp, 
  PlusCircle, Smartphone, Wifi, Plane, Gamepad2, Dumbbell, Briefcase, 
  Utensils, Shirt, Music
};

// 2. La liste des clés pour le sélecteur (pour faire une grille)
export const AVAILABLE_ICONS = Object.keys(ICON_MAP);