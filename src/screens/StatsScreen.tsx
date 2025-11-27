import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { THEME } from '../constants/categories';
import { formatDH } from '../utils/currency';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, PiggyBank, AlertTriangle, ChevronLeft, ChevronRight, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react-native';
import { format, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useFinancials } from '../hooks/useFinancials';

export const StatsScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Maintenant 'savings' est bien fourni par le hook
  const { totalIncome, expenses, savings, savingsRate, categoryStats, variations } = useFinancials(selectedDate);

  // Types Any pour éviter les conflits React 19 (même si tu n'as pas l'erreur color, c'est plus sûr)
  const TrendingUpIcon = TrendingUp as any;
  const TrendingDownIcon = TrendingDown as any;
  const PiggyIcon = PiggyBank as any;
  const AlertIcon = AlertTriangle as any;
  const PrevIcon = ChevronLeft as any;
  const NextIcon = ChevronRight as any;
  const CalendarIcon = Calendar as any;
  const ArrowUp = ArrowUpRight as any;
  const ArrowDown = ArrowDownRight as any;

  const changeMonth = (dir: 'prev' | 'next') => {
    setSelectedDate(dir === 'prev' ? subMonths(selectedDate, 1) : addMonths(selectedDate, 1));
  };

  const VariationBadge = ({ value, inverse = false }: { value: number, inverse?: boolean }) => {
    const isGood = inverse ? value <= 0 : value >= 0;
    const color = isGood ? THEME.colors.income : THEME.colors.expense;
    const IconRaw = value >= 0 ? ArrowUp : ArrowDown;
    const IconAny = IconRaw as any;

    return (
      <View style={[styles.varBadge, { backgroundColor: color + '20' }]}>
        <IconAny size={14} color={color} />
        <Text style={[styles.varText, { color: color }]}>{Math.abs(value).toFixed(0)}%</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistiques 📊</Text>
      </View>

      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => changeMonth('prev')} style={styles.monthBtn}>
            <PrevIcon color={THEME.colors.text} size={24} />
        </TouchableOpacity>
        
        <View style={styles.dateDisplay}>
            <CalendarIcon size={16} color={THEME.colors.primary} style={{marginRight: 8}} />
            <Text style={styles.monthText}>
                {format(selectedDate, 'MMMM yyyy', { locale: fr })}
            </Text>
        </View>

        <TouchableOpacity onPress={() => changeMonth('next')} style={styles.monthBtn}>
            <NextIcon color={THEME.colors.text} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.mainCard}>
          <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%', marginBottom:10}}>
             <Text style={styles.cardLabel}>Taux d'Épargne</Text>
             <PiggyIcon color={THEME.colors.primary} size={24} />
          </View>
          
          <Text style={[
            styles.bigNumber, 
            { color: savings >= 0 ? THEME.colors.success : THEME.colors.danger }
          ]}>
            {savingsRate.toFixed(1)}%
          </Text>
          <Text style={styles.subText}>
            {savings >= 0 ? 'Épargne théorique :' : 'Déficit :'} {formatDH(Math.abs(savings))}
          </Text>

          <View style={styles.gaugeBg}>
            <View style={[
              styles.gaugeFill, 
              { 
                width: `${Math.max(0, Math.min(100, savingsRate))}%`,
                backgroundColor: savings >= 0 ? THEME.colors.success : THEME.colors.danger
              }
            ]} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Comparaison (vs mois dernier)</Text>
        <View style={styles.row}>
          <View style={styles.statBox}>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:5}}>
                <TrendingUpIcon color={THEME.colors.income} size={20} />
                <VariationBadge value={variations.income} />
            </View>
            <Text style={styles.boxLabel}>Revenus</Text>
            <Text style={[styles.boxValue, { color: THEME.colors.income }]}>
              {formatDH(totalIncome)}
            </Text>
          </View>

          <View style={styles.statBox}>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:5}}>
                <TrendingDownIcon color={THEME.colors.expense} size={20} />
                <VariationBadge value={variations.expenses} inverse />
            </View>
            <Text style={styles.boxLabel}>Dépenses</Text>
            <Text style={[styles.boxValue, { color: THEME.colors.expense }]}>
              {formatDH(expenses)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Détails par catégorie</Text>
        {categoryStats.length > 0 ? (
            <View style={styles.listCard}>
                {categoryStats.map((item) => (
                <View key={item.id} style={styles.statRow}>
                    <View style={styles.statHeader}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={[styles.statName, item.isOverBudget && {color: '#D32F2F'}]}>
                                {item.name}
                            </Text>
                            {item.isOverBudget && <AlertIcon size={14} color="#D32F2F" style={{marginLeft:5}} />}
                        </View>
                        <Text style={styles.statVal}>{Math.round(item.percent)}%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${item.percent}%`, backgroundColor: item.color }]} />
                    </View>
                    <Text style={styles.statAmount}>{formatDH(item.amount)}</Text>
                </View>
                ))}
            </View>
        ) : (
            <Text style={{textAlign:'center', color:'#999', marginTop: 20}}>Aucune donnée pour ce mois.</Text>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  header: { padding: 20, backgroundColor: '#fff', paddingBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: THEME.colors.text },
  monthSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  monthBtn: { padding: 10 },
  dateDisplay: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  monthText: { fontSize: 16, fontWeight: 'bold', textTransform: 'capitalize', color: THEME.colors.text },
  content: { padding: 20 },
  mainCard: { backgroundColor: '#fff', padding: 20, borderRadius: 20, alignItems: 'center', marginBottom: 25, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardLabel: { fontSize: 16, color: THEME.colors.text, fontWeight: '600' },
  bigNumber: { fontSize: 40, fontWeight: 'bold', marginBottom: 5 },
  subText: { fontSize: 14, color: '#666', marginBottom: 20 },
  gaugeBg: { width: '100%', height: 12, backgroundColor: '#F0F0F0', borderRadius: 6, overflow: 'hidden' },
  gaugeFill: { height: '100%', borderRadius: 6 },
  row: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  statBox: { flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 16, shadowColor: '#000', shadowOpacity: 0.03, elevation: 1 },
  boxLabel: { fontSize: 14, color: THEME.colors.subtext, marginTop: 5 },
  boxValue: { fontSize: 18, fontWeight: 'bold' },
  varBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  varText: { fontSize: 12, fontWeight: 'bold', marginLeft: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15, color: THEME.colors.text },
  listCard: { backgroundColor: '#fff', padding: 15, borderRadius: 16 },
  statRow: { marginBottom: 15 },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  statName: { fontWeight: '600', color: THEME.colors.text },
  statVal: { color: '#999', fontSize: 12 },
  progressBarBg: { height: 8, backgroundColor: '#f0f0f0', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  statAmount: { fontSize: 12, color: '#666', marginTop: 4, textAlign: 'right' },
});