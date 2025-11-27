import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HelpCircle } from 'lucide-react-native';
import { Transaction, Category } from '../../types';
import { formatDH } from '../../utils/currency';
import { THEME } from '../../constants/categories';
import { ICON_MAP } from '../../constants/icons';
import { useThemeColor } from '../../hooks/useThemeColor'; // <--- Hook

interface Props {
  transaction: Transaction;
  category: Category;
}

export const TransactionItem = ({ transaction, category }: Props) => {
  const colors = useThemeColor(); // <--- Couleurs dynamiques
  
  const IconRaw = ICON_MAP[category.icon] || HelpCircle;
  const IconAny = IconRaw as any;
  const isExpense = transaction.type === 'EXPENSE';

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
        <IconAny size={24} color={category.color} />
      </View>
      <View style={styles.content}>
        {/* Titre dynamique */}
        <Text style={[styles.category, { color: colors.text }]}>{category.name}</Text>
        <Text style={[styles.note, { color: colors.subText }]} numberOfLines={1}>
            {transaction.note ? transaction.note : new Date(transaction.date).toLocaleDateString('fr-FR')}
        </Text>
      </View>
      <Text style={[styles.amount, { color: isExpense ? THEME.colors.expense : THEME.colors.income }]}>
        {isExpense ? '-' : '+'} {formatDH(transaction.amount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  iconContainer: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  content: { flex: 1, marginRight: 10 },
  category: { fontSize: 16, fontWeight: '600' },
  note: { fontSize: 12, marginTop: 2 },
  amount: { fontSize: 16, fontWeight: '700' },
});