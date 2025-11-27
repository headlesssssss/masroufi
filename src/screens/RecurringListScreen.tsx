import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Trash2, Repeat, Pencil } from 'lucide-react-native';

// Imports Architecture
import { useStore } from '../store/useStore';
import { THEME, EXPENSE_CATEGORIES } from '../constants/categories';
import { useThemeColor } from '../hooks/useThemeColor';
import { formatDH } from '../utils/currency';
import { RecurringExpense } from '../types';

export const RecurringListScreen = ({ navigation }: any) => {
  const { 
    recurringExpenses, 
    addRecurringExpense, 
    updateRecurringExpense, 
    deleteRecurringExpense, 
    categories, 
    checkRecurringTransactions // Important pour la synchro immédiate
  } = useStore();
  
  const colors = useThemeColor();

  // --- ÉTATS DU FORMULAIRE ---
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [day, setDay] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  // FIX: Compatibilité React 19 pour les icônes
  const BackIcon = ArrowLeft as any;
  const TrashIcon = Trash2 as any;
  const PlusIcon = Plus as any;
  const RepeatIcon = Repeat as any;
  const EditIcon = Pencil as any; // (Optionnel si tu veux ajouter une icône crayon visible)

  // --- LOGIQUE ---

  // Ouvrir le modal pour CRÉER
  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setAmount('');
    setDay('');
    setSelectedCat(null);
    setModalVisible(true);
  };

  // Ouvrir le modal pour MODIFIER
  const openEditModal = (item: RecurringExpense) => {
    setEditingId(item.id);
    setName(item.name);
    setAmount(item.amount.toString());
    setDay(item.dayOfMonth.toString());
    setSelectedCat(item.categoryId);
    setModalVisible(true);
  };

  // Sauvegarder (Ajout ou Modif)
  const handleSave = () => {
    // 1. Validation
    if (!name || !amount || !day || !selectedCat) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }
    const dayNum = parseInt(day);
    if (dayNum < 1 || dayNum > 31) {
      Alert.alert("Erreur", "Le jour doit être entre 1 et 31");
      return;
    }

    const expenseData = {
      name,
      amount: parseFloat(amount),
      dayOfMonth: dayNum,
      categoryId: selectedCat
    };

    // 2. Mise à jour du Store
    if (editingId) {
      // Modification : On préserve la date de dernière application pour éviter les doublons
      const oldItem = recurringExpenses.find(e => e.id === editingId);
      updateRecurringExpense({
        ...expenseData,
        id: editingId,
        lastAppliedDate: oldItem?.lastAppliedDate 
      });
    } else {
      // Création
      addRecurringExpense(expenseData);
    }

    // 3. SYNCHRONISATION IMMÉDIATE
    // On force la vérification maintenant pour que le Dashboard soit à jour si on revient en arrière
    setTimeout(() => {
        checkRecurringTransactions();
    }, 50);

    // 4. Fermeture
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <BackIcon color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Charges Fixes</Text>
        <TouchableOpacity onPress={openAddModal} style={styles.addHeaderBtn}>
            <PlusIcon color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      {/* Liste */}
      <FlatList
        data={recurringExpenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
            <Text style={{textAlign:'center', marginTop: 50, color: colors.subText}}>
                Aucun prélèvement automatique.{'\n'}Ajoutez votre loyer, Netflix, Salle de sport...
            </Text>
        }
        renderItem={({ item }) => {
            const cat = categories.find(c => c.id === item.categoryId);
            return (
                <TouchableOpacity 
                    style={[styles.item, { backgroundColor: colors.card }]}
                    onPress={() => openEditModal(item)} // Tap pour modifier
                    activeOpacity={0.7}
                >
                    {/* Icône Catégorie */}
                    <View style={{flexDirection:'row', alignItems:'center', flex:1}}>
                        <View style={[styles.iconBg, { backgroundColor: (cat?.color || '#ccc') + '20' }]}>
                            <RepeatIcon size={20} color={cat?.color || '#ccc'} />
                        </View>
                        <View>
                            <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                            <Text style={{ color: colors.subText, fontSize: 12 }}>
                                Le {item.dayOfMonth} du mois • {cat?.name}
                            </Text>
                        </View>
                    </View>
                    
                    {/* Montant & Delete */}
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={[styles.amount, { color: THEME.colors.danger, marginRight: 15 }]}>
                             - {formatDH(item.amount)}
                        </Text>
                        <TouchableOpacity onPress={() => deleteRecurringExpense(item.id)} hitSlop={{top:10, bottom:10, left:10, right:10}}>
                            <TrashIcon size={20} color="#FF5252" />
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            );
        }}
      />

      {/* MODAL (Formulaire) */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                    {editingId ? 'Modifier la charge' : 'Nouvelle charge auto'}
                </Text>
                
                {/* Nom */}
                <TextInput 
                    placeholder="Nom (ex: Loyer)" 
                    placeholderTextColor={colors.subText}
                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                    value={name} onChangeText={setName}
                />

                {/* Montant & Jour */}
                <View style={{flexDirection:'row', gap: 10}}>
                    <TextInput 
                        placeholder="Montant (DH)" 
                        placeholderTextColor={colors.subText}
                        keyboardType="numeric"
                        style={[styles.input, { flex:1, color: colors.text, borderColor: colors.border }]}
                        value={amount} onChangeText={setAmount}
                    />
                    <TextInput 
                        placeholder="Jour (1-31)" 
                        placeholderTextColor={colors.subText}
                        keyboardType="numeric"
                        style={[styles.input, { flex:1, color: colors.text, borderColor: colors.border }]}
                        value={day} onChangeText={setDay}
                    />
                </View>

                {/* Sélecteur Catégorie */}
                <Text style={{color: colors.text, marginVertical: 10, fontWeight:'bold'}}>Catégorie :</Text>
                <View style={{flexDirection:'row', flexWrap:'wrap', gap: 5, marginBottom: 20}}>
                    {EXPENSE_CATEGORIES.map(c => (
                        <TouchableOpacity 
                            key={c.id} 
                            style={[
                                styles.catBadge, 
                                { borderColor: c.color },
                                selectedCat === c.id && { backgroundColor: c.color }
                            ]}
                            onPress={() => setSelectedCat(c.id)}
                        >
                            <Text style={{color: selectedCat === c.id ? '#fff' : c.color, fontSize:10, fontWeight:'600'}}>
                                {c.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Boutons Action */}
                <View style={{flexDirection:'row', justifyContent:'flex-end', gap: 10}}>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                        <Text style={{color: colors.text}}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                        <Text style={{color:'#fff', fontWeight:'bold'}}>
                            {editingId ? 'Mettre à jour' : 'Ajouter'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  backBtn: { marginRight: 15 },
  title: { fontSize: 20, fontWeight: 'bold', flex: 1 },
  addHeaderBtn: { backgroundColor: THEME.colors.primary, padding: 8, borderRadius: 20 },
  
  item: { flexDirection: 'row', padding: 15, borderRadius: 12, marginBottom: 10, alignItems: 'center' },
  iconBg: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  name: { fontSize: 16, fontWeight: '600' },
  amount: { fontSize: 16, fontWeight: 'bold' },
  
  // Modal Styles
  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', padding: 20 },
  modalContent: { padding: 20, borderRadius: 16, shadowColor: "#000", shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 10, fontSize: 16 },
  catBadge: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  cancelBtn: { padding: 12, paddingHorizontal: 20 },
  saveBtn: { backgroundColor: THEME.colors.primary, padding: 12, paddingHorizontal: 20, borderRadius: 8 }
});