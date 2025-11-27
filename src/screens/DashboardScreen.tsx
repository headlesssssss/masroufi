import React, { useCallback } from 'react'; // <--- Import useCallback
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native'; // <--- Import useFocusEffect
import { Plus, AlertTriangle, Calendar } from 'lucide-react-native';

import { useStore } from '../store/useStore';
import { useFinancials } from '../hooks/useFinancials';
import { useThemeColor } from '../hooks/useThemeColor';
import { THEME } from '../constants/categories';
import { BalanceCard } from '../components/organisms/BalanceCard';
import { TransactionItem } from '../components/molecules/TransactionItem';
import { formatDH } from '../utils/currency';

export const DashboardScreen = ({ navigation }: any) => {
  const { transactions, categories, checkRecurringTransactions } = useStore();
  const { categoryStats, balance, totalIncome, expenses } = useFinancials(); 
  const colors = useThemeColor();

  const PlusIcon = Plus as any;
  const AlertIcon = AlertTriangle as any;
  const CalendarIcon = Calendar as any;

  // CORRECTION MAJEURE ICI :
  // On utilise useFocusEffect au lieu de useEffect.
  // Cela garantit que la vérification se lance à CHAQUE fois qu'on revient sur l'écran.
  useFocusEffect(
    useCallback(() => {
      checkRecurringTransactions();
    }, [])
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>Masroufi 🇲🇦</Text>
            <Text style={[styles.subGreeting, { color: colors.subText }]}>Aperçu du mois en cours</Text>
          </View>
        </View>

        <BalanceCard 
            balance={balance} 
            income={totalIncome} 
            expenses={expenses} 
        />

        {balance < 0 && (
          <View style={[styles.alertBox, { backgroundColor: colors.isDark ? '#3E1010' : '#FFEBEE', borderLeftColor: '#D32F2F' }]}>
            <AlertIcon color="#D32F2F" size={24} />
            <View style={{marginLeft: 12, flex: 1}}>
                <Text style={styles.alertTitle}>Attention !</Text>
                <Text style={styles.alertText}>
                    Dépassement de {formatDH(Math.abs(balance))} sur ce mois.
                </Text>
            </View>
          </View>
        )}

        {categoryStats.length > 0 ? (
          <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Répartition des dépenses</Text>
            
            {categoryStats.map((item) => (
              <View key={item.id} style={styles.statRow}>
                <View style={styles.statHeader}>
                  <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                      <Text style={[styles.statName, { color: colors.text }, item.isOverBudget && {color: '#D32F2F'}]} numberOfLines={1}>
                        {item.name}
                      </Text>
                      {item.isOverBudget && (
                          <View style={styles.badgeError}>
                              <Text style={styles.badgeText}>⚠️</Text>
                          </View>
                      )}
                  </View>
                  <Text style={styles.statVal}>{Math.round(item.percent)}%</Text>
                </View>
                
                <View style={[styles.progressBarBg, { backgroundColor: colors.isDark ? '#333' : '#f0f0f0' }]}>
                    <View style={[
                        styles.progressBarFill, 
                        { width: `${item.percent}%`, backgroundColor: item.color }
                    ]} />
                </View>
                
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 4}}>
                    {item.limit > 0 ? (
                        <Text style={{fontSize: 10, color: colors.subText}}>Max: {formatDH(item.limit)}</Text>
                    ) : <View/>}
                    <Text style={[styles.statAmount, item.isOverBudget && {color: '#D32F2F', fontWeight: 'bold'}]}>
                        {formatDH(item.amount)}
                    </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
             <CalendarIcon size={40} color={colors.subText} />
             <Text style={[styles.emptyText, { color: colors.subText }]}>Rien pour ce mois-ci.</Text>
          </View>
        )}

        <View style={styles.listHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Derniers ajouts</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Historique')}>
            <Text style={{color: THEME.colors.primary, fontWeight:'600'}}>Tout voir</Text>
          </TouchableOpacity>
        </View>
        
        {transactions.slice(0, 5).map(t => {
            const cat = categories.find(c => c.id === t.categoryId);
            if(!cat) return null;
            return <TransactionItem key={t.id} transaction={t} category={cat} />;
        })}

      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddTransaction')}>
        <PlusIcon color="#FFF" size={32} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: 'bold' },
  subGreeting: { fontSize: 13 },
  alertBox: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 20, borderLeftWidth: 4 },
  alertTitle: { color: '#D32F2F', fontWeight: 'bold', fontSize: 14 },
  alertText: { color: '#C62828', fontSize: 12 },
  statsContainer: { padding: 15, borderRadius: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
  statRow: { marginBottom: 15 },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  statName: { fontWeight: '600', maxWidth: '60%' },
  statVal: { color: '#999', fontSize: 12 },
  progressBarBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  statAmount: { fontSize: 12, color: '#666', marginTop: 4, textAlign: 'right' },
  badgeError: { marginLeft: 8, backgroundColor: '#FFEBEE', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: '#D32F2F', fontSize: 10, fontWeight: 'bold' },
  listHeader: { flexDirection:'row', justifyContent:'space-between', marginBottom: 10, alignItems:'center' },
  emptyState: { padding: 20, alignItems: 'center' },
  emptyText: { marginTop: 10 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: THEME.colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65 }
});