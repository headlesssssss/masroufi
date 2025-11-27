import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Switch } from 'react-native';
import { useStore } from '../store/useStore';
import { THEME } from '../constants/categories';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Save, Trash2, Tag, ChevronRight, FileText, Moon, Sun } from 'lucide-react-native';
import { generatePDF } from '../utils/pdfGenerator';

export const SettingsScreen = ({ navigation }: any) => {
  const { monthlyIncome, setMonthlyIncome, reset, transactions, categories, isDarkMode, toggleTheme } = useStore();
  const [incomeInput, setIncomeInput] = useState(monthlyIncome.toString());

  // FIX: Force le type pour React 19
  const SaveIcon = Save as any;
  const TrashIcon = Trash2 as any;
  const TagIcon = Tag as any;
  const ChevronIcon = ChevronRight as any;
  const FileIcon = FileText as any;
  const MoonIcon = Moon as any;
  const SunIcon = Sun as any;

  // Couleurs dynamiques selon le mode
  const bgColor = isDarkMode ? '#121212' : THEME.colors.background;
  const cardColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : THEME.colors.text;
  const subTextColor = isDarkMode ? '#AAAAAA' : THEME.colors.subtext;

  useEffect(() => {
    setIncomeInput(monthlyIncome.toString());
  }, [monthlyIncome]);

  const handleSaveIncome = () => {
    const amount = parseFloat(incomeInput);
    if (isNaN(amount) || amount < 0) {
      Alert.alert("Erreur", "Veuillez entrer un montant valide.");
      return;
    }
    setMonthlyIncome(amount);
    Alert.alert("Succès", "Votre revenu mensuel a été mis à jour !");
  };

  const handleExport = async () => {
    if (transactions.length === 0) {
      Alert.alert("Info", "Aucune transaction à exporter.");
      return;
    }
    await generatePDF(transactions, categories);
  };

  const handleReset = () => {
    Alert.alert(
      "Attention ⚠️",
      "Voulez-vous vraiment effacer TOUT l'historique ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Tout Effacer", 
          style: "destructive", 
          onPress: () => {
            reset();
            setIncomeInput('0');
            Alert.alert("Reset effectué", "L'application a été remise à zéro.");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={[styles.header, { backgroundColor: cardColor, borderBottomColor: isDarkMode ? '#333' : '#eee' }]}>
        <Text style={[styles.title, { color: textColor }]}>Paramètres</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* --- Section 1 : Apparence --- */}
        <View style={[styles.section, { backgroundColor: cardColor }]}>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    {isDarkMode ? <MoonIcon color="#90CAF9" size={24} /> : <SunIcon color="orange" size={24} />}
                    <Text style={[styles.menuText, { marginLeft: 10, color: textColor }]}>Mode Sombre</Text>
                </View>
                <Switch 
                    value={isDarkMode} 
                    onValueChange={toggleTheme}
                    trackColor={{false: '#767577', true: THEME.colors.primary}}
                />
            </View>
        </View>

        {/* --- Section 2 : Revenu --- */}
        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Revenu Mensuel Fixe</Text>
          <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#2C2C2C' : '#FAFAFA', borderColor: isDarkMode ? '#444' : '#ddd' }]}>
            <Text style={styles.currency}>DH</Text>
            <TextInput 
              style={[styles.input, { color: textColor }]}
              keyboardType="numeric"
              value={incomeInput}
              onChangeText={setIncomeInput}
              placeholder="0"
              placeholderTextColor="#999"
            />
          </View>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveIncome}>
            <SaveIcon color="white" size={20} style={{marginRight: 10}} />
            <Text style={styles.btnText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>

        {/* --- Section 3 : Actions --- */}
        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Gestion</Text>

          {/* Modifier Catégories */}
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('CategoryList')}>
            <View style={styles.menuLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                    <TagIcon color="#2196F3" size={20} />
                </View>
                <Text style={[styles.menuText, { color: textColor }]}>Modifier les catégories</Text>
            </View>
            <ChevronIcon color="#ccc" size={20} />
          </TouchableOpacity>
          
          {/* Export PDF */}
          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleExport}>
            <View style={styles.menuLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                    <FileIcon color="#4CAF50" size={20} />
                </View>
                <Text style={[styles.menuText, { color: textColor }]}>Exporter en PDF</Text>
            </View>
            <ChevronIcon color="#ccc" size={20} />
          </TouchableOpacity>
        </View>

        {/* --- Section 4 : Danger --- */}
        <View style={[styles.section, styles.dangerSection, { backgroundColor: cardColor, borderColor: '#ffcdd2' }]}>
          <Text style={[styles.sectionTitle, { color: THEME.colors.danger }]}>Zone de Danger</Text>
          <TouchableOpacity style={styles.dangerBtn} onPress={handleReset}>
            <TrashIcon color="white" size={20} style={{marginRight: 10}} />
            <Text style={styles.btnText}>Tout effacer / Reset</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.versionText}>Masroufi v1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, borderBottomWidth: 1 },
  title: { fontSize: 24, fontWeight: 'bold' },
  content: { padding: 20, paddingBottom: 50 },
  section: { padding: 20, borderRadius: 16, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 15, marginBottom: 15 },
  currency: { fontSize: 18, fontWeight: 'bold', color: '#888', marginRight: 10 },
  input: { flex: 1, fontSize: 18, fontWeight: 'bold', paddingVertical: 12 },
  saveBtn: { backgroundColor: THEME.colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 12 },
  dangerBtn: { backgroundColor: THEME.colors.danger, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 12 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuText: { fontSize: 16, fontWeight: '500' },
  dangerSection: { borderWidth: 1 },
  versionText: { textAlign: 'center', color: '#ccc', fontSize: 12, marginTop: 10 }
});