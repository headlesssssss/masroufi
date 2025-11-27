import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useStore } from '../store/useStore';
import { THEME, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';

export const AddTransactionScreen = ({ navigation, route }: any) => {
  const { addTransaction, updateTransaction } = useStore();
  
  // On récupère la transaction si elle est passée en paramètre (Mode Édition)
  const transactionToEdit = route.params?.transaction;
  const isEditing = !!transactionToEdit;

  // FIX: Force le type pour React 19
  const BackIcon = ArrowLeft as any;

  // États initiaux (vides ou pré-remplis)
  const [amount, setAmount] = useState(transactionToEdit ? transactionToEdit.amount.toString() : '');
  const [note, setNote] = useState(transactionToEdit ? transactionToEdit.note : '');
  const [selectedCat, setSelectedCat] = useState<string | null>(transactionToEdit ? transactionToEdit.categoryId : null);
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>(transactionToEdit ? transactionToEdit.type : 'EXPENSE');

  const currentCategories = type === 'EXPENSE' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // Effet pour basculer automatiquement si on édite (sécurité)
  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setSelectedCat(transactionToEdit.categoryId);
    }
  }, [transactionToEdit]);

  const handleSave = () => {
    if (!amount || !selectedCat) {
      Alert.alert('Oups', 'Merci de saisir un montant et une catégorie');
      return;
    }
    
    const txData = {
      amount: parseFloat(amount),
      categoryId: selectedCat,
      date: transactionToEdit ? transactionToEdit.date : new Date().toISOString(), // On garde la date originale si on édite
      note: note,
      type: type
    };

    if (isEditing) {
      // MODE MODIFICATION
      updateTransaction({ ...txData, id: transactionToEdit.id });
    } else {
      // MODE CRÉATION
      addTransaction(txData);
    }
    
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <BackIcon color={THEME.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEditing ? 'Modifier l\'opération' : 'Nouvelle Opération'}
        </Text>
      </View>

      {/* Switch Dépense / Revenu (Désactivé si on édite pour simplifier, ou actif selon ton choix) */}
      <View style={styles.switchContainer}>
        <TouchableOpacity 
          style={[styles.switchBtn, type === 'EXPENSE' && styles.switchBtnActiveExpense]} 
          onPress={() => { setType('EXPENSE'); setSelectedCat(null); }}
        >
          <Text style={[styles.switchText, type === 'EXPENSE' && styles.switchTextActive]}>Dépense</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.switchBtn, type === 'INCOME' && styles.switchBtnActiveIncome]} 
          onPress={() => { setType('INCOME'); setSelectedCat(null); }}
        >
          <Text style={[styles.switchText, type === 'INCOME' && styles.switchTextActive]}>Revenu</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{paddingBottom: 40}}>
        <View style={styles.inputContainer}>
          <Text style={[styles.currencySymbol, { color: type === 'EXPENSE' ? THEME.colors.danger : THEME.colors.income }]}>DH</Text>
          <TextInput
            style={[styles.amountInput, { color: type === 'EXPENSE' ? THEME.colors.danger : THEME.colors.income }]}
            placeholder="0"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            autoFocus={!isEditing} // Focus auto seulement si c'est nouveau
          />
        </View>

        <Text style={styles.sectionLabel}>Catégorie</Text>
        <View style={styles.catGrid}>
          {currentCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.catItem,
                selectedCat === cat.id && { backgroundColor: cat.color, borderColor: cat.color }
              ]}
              onPress={() => setSelectedCat(cat.id)}
            >
              <Text style={[
                styles.catName,
                selectedCat === cat.id && { color: '#FFF' }
              ]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ padding: 20 }}>
          <Text style={styles.sectionLabel}>Note (Optionnel)</Text>
          <TextInput
            style={styles.textInput}
            placeholder={type === 'EXPENSE' ? "Ex: Tajine, Café..." : "Ex: Vente tapis, Prime..."}
            value={note}
            onChangeText={setNote}
          />
        </View>

        <TouchableOpacity 
            style={[styles.saveBtn, { backgroundColor: type === 'EXPENSE' ? THEME.colors.primary : THEME.colors.income }]} 
            onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>
            {isEditing ? 'Mettre à jour' : (type === 'EXPENSE' ? 'Enregistrer la Dépense' : 'Enregistrer le Revenu')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backBtn: { marginRight: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: THEME.colors.text },
  switchContainer: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: '#E0E0E0', borderRadius: 12, padding: 4, marginBottom: 20 },
  switchBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  switchBtnActiveExpense: { backgroundColor: '#fff', shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  switchBtnActiveIncome: { backgroundColor: '#fff', shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  switchText: { fontWeight: '600', color: '#757575' },
  switchTextActive: { color: '#000', fontWeight: 'bold' },
  inputContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10 },
  currencySymbol: { fontSize: 24, marginRight: 8, fontWeight: 'bold' },
  amountInput: { fontSize: 48, fontWeight: 'bold' },
  sectionLabel: { paddingHorizontal: 20, marginBottom: 10, color: THEME.colors.subtext, fontWeight: '600' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15 },
  catItem: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1, borderColor: '#ddd', margin: 5,
    backgroundColor: '#fff',
  },
  catName: { fontWeight: '600', color: THEME.colors.text, fontSize: 13 },
  textInput: { backgroundColor: '#fff', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
  saveBtn: { margin: 20, padding: 16, borderRadius: 12, alignItems: 'center', shadowColor: "#000", shadowOffset: {width:0, height:2}, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  saveBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});