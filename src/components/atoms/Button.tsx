import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { THEME } from '../../constants/categories';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'income';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button = ({ title, onPress, variant = 'primary', isLoading, icon }: ButtonProps) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'danger': return THEME.colors.danger;
      case 'income': return THEME.colors.income;
      case 'secondary': return '#E0E0E0';
      default: return THEME.colors.primary;
    }
  };

  const textColor = variant === 'secondary' ? '#333' : '#FFF';

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: getBackgroundColor() }]} 
      onPress={onPress}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[styles.text, { color: textColor, marginLeft: icon ? 10 : 0 }]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});