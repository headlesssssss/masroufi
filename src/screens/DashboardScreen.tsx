import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, AlertTriangle, Calendar } from 'lucide-react-native';

// Imports Architecture
import { useStore } from '../store/useStore';
import { useFinancials } from '../hooks/useFinancials';
import { THEME } from '../constants/categories';
import { BalanceCard } from '../components/organisms/BalanceCard';
import { TransactionItem } from '../components/molecules/TransactionItem';
import { formatDH } from '../utils/currency';

export const DashboardScreen = ({ navigation }: any) => {
  const { transactions, categories } = useStore();
  
  // On appelle le hook SANS date => Il prend automatiquement le mois en cours
  const { categoryStats, balance, totalIncome, expenses } = useFinancials(); 

  // FIX: Force le type pour React 19
  const PlusIcon = Plus as any;
  const AlertIcon = AlertTriangle as any;
  const CalendarIcon = Calendar as any;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Simple */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Masroufi 🇲🇦</Text>
            <Text style={styles.subGreeting}>Aperçu du mois en cours</Text>
          </View>
        </View>

        {/* Carte de Solde (Mois actuel) */}
        <BalanceCard 
            balance={balance} 
            income={totalIncome} 
            expenses={expenses} 
        />

        {/* 🚨 ALERTE (Si solde négatif ce mois-ci) 🚨 */}
        {balance < 0 && (
          <View style={styles.alertBox}>
            <AlertIcon color="#D32F2F" size={24} />
            <View style={{marginLeft: 12, flex: 1}}>
                <Text style={styles.alertTitle}>Attention !</Text>
                <Text style={styles.alertText}>
                    Dépassement de {formatDH(Math.abs(balance))} sur ce mois.
                </Text>
            </View>
          </View>
        )}

        {/* Visualisation (Barres) */}
        {categoryStats.length > 0 ? (
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Répartition des dépenses</Text>
            
            {categoryStats.map((item) => (
              <View key={item.id} style={styles.statRow}>
                <View style={styles.statHeader}>
                  <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                      <Text style={[styles.statName, item.isOverBudget && {color: '#D32F2F'}]} numberOfLines={1}>
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
                
                <View style={styles.progressBarBg}>
                    <View style={[
                        styles.progressBarFill, 
                        { width: `${item.percent}%`, backgroundColor: item.color }
                    ]} />
                </View>
                
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 4}}>
                    {item.limit > 0 ? (
                        <Text style={{fontSize: 10, color: '#999'}}>Max: {formatDH(item.limit)}</Text>
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
             <CalendarIcon size={40} color="#ddd" />
             <Text style={styles.emptyText}>Rien pour ce mois-ci.</Text>
          </View>
        )}

        {/* Liste Récente (Globale) */}
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Derniers ajouts</Text>
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

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddTransaction')}>
        <PlusIcon color="#FFF" size={32} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: THEME.colors.text },
  subGreeting: { fontSize: 13, color: THEME.colors.subtext },

  alertBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBEE', padding: 12, borderRadius: 12, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: '#D32F2F' },
  alertTitle: { color: '#D32F2F', fontWeight: 'bold', fontSize: 14 },
  alertText: { color: '#C62828', fontSize: 12 },

  statsContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
  statRow: { marginBottom: 15 },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  statName: { fontWeight: '600', color: THEME.colors.text, maxWidth: '60%' },
  statVal: { color: '#999', fontSize: 12 },
  
  progressBarBg: { height: 8, backgroundColor: '#f0f0f0', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  statAmount: { fontSize: 12, color: '#666', marginTop: 4, textAlign: 'right' },
  
  badgeError: { marginLeft: 8, backgroundColor: '#FFEBEE', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: '#D32F2F', fontSize: 10, fontWeight: 'bold' },

  listHeader: { flexDirection:'row', justifyContent:'space-between', marginBottom: 10, alignItems:'center' },
  emptyState: { padding: 20, alignItems: 'center' },
  emptyText: { color: '#999', marginTop: 10 },
  
  fab: {
    position: 'absolute', bottom: 20, right: 20, width: 60, height: 60,
    borderRadius: 30, backgroundColor: THEME.colors.primary,
    justifyContent: 'center', alignItems: 'center', elevation: 5
  }
});