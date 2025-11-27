import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../../constants/categories';
import { formatDH } from '../../utils/currency';

// 1. On définit ce que la carte accepte comme données
interface Props {
  balance: number;
  income: number;
  expenses: number;
}

// 2. On change la définition du composant pour qu'il utilise ces "Props"
export const BalanceCard = ({ balance, income, expenses }: Props) => {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.labelLight}>Solde Restant</Text>
        <Text style={styles.balanceText}>{formatDH(balance)}</Text>
      </View>
      <View style={styles.row}>
        <View>
          <Text style={styles.labelLightSmall}>Revenus</Text>
          <Text style={styles.incomeText}>+ {formatDH(income)}</Text>
        </View>
        <View>
          <Text style={styles.labelLightSmall}>Dépenses</Text>
          <Text style={styles.expenseText}>- {formatDH(expenses)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.primary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  labelLight: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  labelLightSmall: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  balanceText: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginVertical: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  incomeText: { color: '#82F5C9', fontWeight: 'bold', fontSize: 16 },
  expenseText: { color: '#FF9EAA', fontWeight: 'bold', fontSize: 16 },
});