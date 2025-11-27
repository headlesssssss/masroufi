import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useStore } from '../store/useStore';
import { THEME } from '../constants/categories';
import { TransactionItem } from '../components/molecules/TransactionItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Trash2, Pencil, ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import { format, subMonths, addMonths, isSameMonth } from 'date-fns';
import { fr } from 'date-fns/locale'; // Pour avoir les mois en français

export const HistoryScreen = ({ navigation }: any) => {
  const { transactions, categories, deleteTransaction } = useStore();
  
  // Date sélectionnée (par défaut aujourd'hui)
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Icons FIX React 19
  const BackIcon = ArrowLeft as any;
  const TrashIcon = Trash2 as any;
  const EditIcon = Pencil as any;
  const PrevIcon = ChevronLeft as any;
  const NextIcon = ChevronRight as any;
  const CalendarIcon = Calendar as any;

  // Filtrer par mois sélectionné
  const monthlyTransactions = useMemo(() => {
    return transactions
      .filter(t => isSameMonth(new Date(t.date), selectedDate))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedDate]);

  const changeMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') setSelectedDate(subMonths(selectedDate, 1));
    else setSelectedDate(addMonths(selectedDate, 1));
  };

  const handleDelete = (id: string) => { /* ... code existant ... */ };
  const handleEdit = (transaction: any) => { navigation.navigate('AddTransaction', { transaction }); };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header Standard */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <BackIcon color={THEME.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Historique</Text>
      </View>

      {/* --- SÉLECTEUR DE MOIS --- */}
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

      {/* Liste Filtrée */}
      <FlatList
        data={monthlyTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune opération en {format(selectedDate, 'MMMM', {locale: fr})}.</Text>
          </View>
        }
        renderItem={({ item }) => {
            // ... code existant du renderItem ...
            const cat = categories.find(c => c.id === item.categoryId);
            if (!cat) return null;
  
            return (
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <TransactionItem transaction={item} category={cat} />
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => handleEdit(item)} style={[styles.actionBtn, { backgroundColor: '#E3F2FD', marginRight: 8 }]}>
                      <EditIcon size={18} color="#2196F3" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.actionBtn, { backgroundColor: '#FFEBEE' }]}>
                      <TrashIcon size={18} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>
            );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  backBtn: { marginRight: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: THEME.colors.text },
  
  // Styles Sélecteur Mois
  monthSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  monthBtn: { padding: 10 },
  dateDisplay: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  monthText: { fontSize: 16, fontWeight: 'bold', textTransform: 'capitalize', color: THEME.colors.text },

  emptyContainer: { marginTop: 50, alignItems: 'center' },
  emptyText: { color: '#999', fontSize: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 },
  actions: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  actionBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }
});