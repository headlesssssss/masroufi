import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { THEME } from '../../constants/categories';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Card = ({ children, style }: CardProps) => (
  <View style={[{
    backgroundColor: THEME.colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 12
  }, style]}>
    {children}
  </View>
);