import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useStore } from '../store/useStore';
import { THEME, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useThemeColor } from '../hooks/useThemeColor'; // <--- Hook

export const AddTransactionScreen = ({ navigation, route }: any) => {
  const { addTransaction, updateTransaction } = useStore();
  const colors = useThemeColor(); // <--- Couleurs

  const transactionToEdit = route.params?.transaction;
  const isEditing = !!transactionToEdit;
  const BackIcon = ArrowLeft as any;

  const [amount, setAmount] = useState(transactionToEdit ? transactionToEdit.amount.toString() : '');
  const [note, setNote] = useState(transactionToEdit ? transactionToEdit.note : '');
  const [selectedCat, setSelectedCat] = useState<string | null>(transactionToEdit ? transactionToEdit.categoryId : null);
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>(transactionToEdit ? transactionToEdit.type : 'EXPENSE');

  const currentCategories = type === 'EXPENSE' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

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
      date: transactionToEdit ? transactionToEdit.date : new Date().toISOString(),
      note: note,
      type: type
    };

    if (isEditing) updateTransaction({ ...txData, id: transactionToEdit.id });
    else addTransaction(txData);
    
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <BackIcon color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          {isEditing ? 'Modifier l\'opération' : 'Nouvelle Opération'}
        </Text>
      </View>

      <View style={[styles.switchContainer, { backgroundColor: colors.isDark ? '#333' : '#E0E0E0' }]}>
        <TouchableOpacity 
          style={[styles.switchBtn, type === 'EXPENSE' && { backgroundColor: colors.card }]} 
          onPress={() => { setType('EXPENSE'); setSelectedCat(null); }}
        >
          <Text style={[styles.switchText, type === 'EXPENSE' && { color: colors.text, fontWeight: 'bold' }]}>Dépense</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.switchBtn, type === 'INCOME' && { backgroundColor: colors.card }]} 
          onPress={() => { setType('INCOME'); setSelectedCat(null); }}
        >
          <Text style={[styles.switchText, type === 'INCOME' && { color: colors.text, fontWeight: 'bold' }]}>Revenu</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{paddingBottom: 40}}>
        <View style={styles.inputContainer}>
          <Text style={[styles.currencySymbol, { color: type === 'EXPENSE' ? THEME.colors.danger : THEME.colors.income }]}>DH</Text>
          <TextInput
            style={[styles.amountInput, { color: type === 'EXPENSE' ? THEME.colors.danger : THEME.colors.income }]}
            placeholder="0"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            autoFocus={!isEditing}
          />
        </View>

        <Text style={styles.sectionLabel}>Catégorie</Text>
        <View style={styles.catGrid}>
          {currentCategories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.catItem,
                { backgroundColor: colors.card, borderColor: colors.border },
                selectedCat === cat.id && { backgroundColor: cat.color, borderColor: cat.color }
              ]}
              onPress={() => setSelectedCat(cat.id)}
            >
              <Text style={[
                styles.catName,
                { color: colors.text },
                selectedCat === cat.id && { color: '#FFF' }
              ]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ padding: 20 }}>
          <Text style={styles.sectionLabel}>Note (Optionnel)</Text>
          <TextInput
            style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
            placeholder={type === 'EXPENSE' ? "Ex: Tajine, Café..." : "Ex: Vente tapis, Prime..."}
            placeholderTextColor={colors.subText}
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
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backBtn: { marginRight: 15 },
  title: { fontSize: 20, fontWeight: 'bold' },
  switchContainer: { flexDirection: 'row', marginHorizontal: 20, borderRadius: 12, padding: 4, marginBottom: 20 },
  switchBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  switchText: { fontWeight: '600', color: '#757575' },
  inputContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10 },
  currencySymbol: { fontSize: 24, marginRight: 8, fontWeight: 'bold' },
  amountInput: { fontSize: 48, fontWeight: 'bold' },
  sectionLabel: { paddingHorizontal: 20, marginBottom: 10, color: '#999', fontWeight: '600' },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15 },
  catItem: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
    borderWidth: 1, margin: 5,
  },
  catName: { fontWeight: '600', fontSize: 13 },
  textInput: { padding: 15, borderRadius: 12, borderWidth: 1 },
  saveBtn: { margin: 20, padding: 16, borderRadius: 12, alignItems: 'center', shadowColor: "#000", shadowOffset: {width:0, height:2}, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  saveBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});