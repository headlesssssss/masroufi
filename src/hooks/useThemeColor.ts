import { useStore } from '../store/useStore';
import { THEME } from '../constants/categories';

export const useThemeColor = () => {
  const { isDarkMode } = useStore();

  const colors = {
    // Fond principal
    background: isDarkMode ? '#121212' : THEME.colors.background,
    // Fond des cartes / barre de navigation
    card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    // Texte principal
    text: isDarkMode ? '#FFFFFF' : THEME.colors.text,
    // Texte secondaire
    subText: isDarkMode ? '#AAAAAA' : THEME.colors.subtext,
    // Bordures
    border: isDarkMode ? '#333333' : '#E0E0E0',
    // Couleur primaire (reste la même ou s'adapte)
    primary: THEME.colors.primary,
    // Indicateur de mode
    isDark: isDarkMode,
  };

  return colors;
};