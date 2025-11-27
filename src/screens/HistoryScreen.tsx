import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Trash2, Pencil, ChevronLeft, ChevronRight, Calendar } from 'lucide-react-native';
import { format, subMonths, addMonths, isSameMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

// Imports Architecture
import { useStore } from '../store/useStore';
import { THEME } from '../constants/categories';
import { TransactionItem } from '../components/molecules/TransactionItem';
import { useThemeColor } from '../hooks/useThemeColor'; // Hook de thème

export const HistoryScreen = ({ navigation }: any) => {
  const { transactions, categories, deleteTransaction } = useStore();
  const colors = useThemeColor(); // Récupération des couleurs dynamiques
  
  const [selectedDate, setSelectedDate] = useState(new Date());

  // FIX: Compatibilité React 19 pour les icônes
  const BackIcon = ArrowLeft as any;
  const TrashIcon = Trash2 as any;
  const EditIcon = Pencil as any;
  const PrevIcon = ChevronLeft as any;
  const NextIcon = ChevronRight as any;
  const CalendarIcon = Calendar as any;

  // --- COULEURS DYNAMIQUES DES BOUTONS ---
  // Mode Sombre : Fond transparent et icône claire
  // Mode Clair : Fond pastel et icône vive
  const editBg = colors.isDark ? 'rgba(33, 150, 243, 0.2)' : '#E3F2FD';
  const editIconColor = colors.isDark ? '#90CAF9' : '#2196F3';

  const deleteBg = colors.isDark ? 'rgba(244, 67, 54, 0.2)' : '#FFEBEE';
  const deleteIconColor = colors.isDark ? '#EF9A9A' : '#F44336';

  const monthlyTransactions = useMemo(() => {
    return transactions
      .filter(t => isSameMonth(new Date(t.date), selectedDate))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedDate]);

  const changeMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') setSelectedDate(subMonths(selectedDate, 1));
    else setSelectedDate(addMonths(selectedDate, 1));
  };

  const handleDelete = (id: string) => {
    Alert.alert("Supprimer", "Voulez-vous vraiment supprimer ?", [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: () => deleteTransaction(id) }
    ]);
  };
  
  const handleEdit = (transaction: any) => { navigation.navigate('AddTransaction', { transaction }); };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <BackIcon color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Historique</Text>
      </View>

      {/* Sélecteur de Mois */}
      <View style={[styles.monthSelector, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => changeMonth('prev')} style={styles.monthBtn}>
            <PrevIcon color={colors.text} size={24} />
        </TouchableOpacity>
        
        <View style={[styles.dateDisplay, { backgroundColor: colors.isDark ? '#333' : '#F5F5F5' }]}>
            <CalendarIcon size={16} color={THEME.colors.primary} style={{marginRight: 8}} />
            <Text style={[styles.monthText, { color: colors.text }]}>
                {format(selectedDate, 'MMMM yyyy', { locale: fr })}
            </Text>
        </View>

        <TouchableOpacity onPress={() => changeMonth('next')} style={styles.monthBtn}>
            <NextIcon color={colors.text} size={24} />
        </TouchableOpacity>
      </View>

      {/* Liste */}
      <FlatList
        data={monthlyTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <CalendarIcon size={48} color={colors.subText} style={{ marginBottom: 10, opacity: 0.5 }} />
            <Text style={[styles.emptyText, { color: colors.subText }]}>
                Aucune opération en {format(selectedDate, 'MMMM', {locale: fr})}.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
            const cat = categories.find(c => c.id === item.categoryId);
            if (!cat) return null;
  
            return (
              <View style={styles.row}>
                {/* L'item prend toute la place gauche */}
                <View style={{ flex: 1 }}>
                  <TransactionItem transaction={item} category={cat} />
                </View>

                {/* Boutons d'action à droite */}
                <View style={styles.actions}>
                  <TouchableOpacity 
                    onPress={() => handleEdit(item)} 
                    style={[styles.actionBtn, { backgroundColor: editBg, marginRight: 8 }]}
                  >
                      <EditIcon size={18} color={editIconColor} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => handleDelete(item.id)} 
                    style={[styles.actionBtn, { backgroundColor: deleteBg }]}
                  >
                      <TrashIcon size={18} color={deleteIconColor} />
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
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  backBtn: { marginRight: 15 },
  title: { fontSize: 20, fontWeight: 'bold' },
  monthSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 10, borderBottomWidth: 1 },
  monthBtn: { padding: 10 },
  dateDisplay: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  monthText: { fontSize: 16, fontWeight: 'bold', textTransform: 'capitalize' },
  emptyContainer: { marginTop: 50, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actions: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  actionBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }
});