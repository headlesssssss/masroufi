import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useStore } from '../store/useStore';
import { THEME } from '../constants/categories';
import { ICON_MAP, AVAILABLE_ICONS } from '../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save } from 'lucide-react-native';

export const EditCategoryScreen = ({ navigation, route }: any) => {
  const { category } = route.params;
  const { updateCategory } = useStore();
  
  const [name, setName] = useState(category.name);
  const [selectedIcon, setSelectedIcon] = useState(category.icon);
  // On initialise avec la limite existante ou vide
  const [limit, setLimit] = useState(category.budgetLimit ? category.budgetLimit.toString() : '');

  const BackIcon = ArrowLeft as any;
  const SaveIcon = Save as any;

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Erreur", "Le nom ne peut pas être vide");
      return;
    }

    updateCategory({
      ...category,
      name: name,
      icon: selectedIcon,
      budgetLimit: limit ? parseFloat(limit) : undefined // On sauvegarde la limite
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <BackIcon color={THEME.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Modifier</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
           <SaveIcon color="#fff" size={20} />
           <Text style={styles.saveText}>OK</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        {/* Nom */}
        <Text style={styles.label}>Nom de la catégorie</Text>
        <TextInput 
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        {/* NOUVEAU : Budget Limite */}
        <Text style={styles.label}>Budget mensuel limite (Optionnel)</Text>
        <Text style={styles.helper}>Recevez une alerte si vous dépassez ce montant.</Text>
        <View style={styles.inputContainer}>
            <Text style={styles.currency}>DH</Text>
            <TextInput 
              style={[styles.input, { flex: 1 }]}
              value={limit}
              onChangeText={setLimit}
              placeholder="Ex: 2000"
              keyboardType="numeric"
            />
        </View>

        {/* Icônes */}
        <Text style={styles.label}>Choisir une icône</Text>
        <View style={styles.grid}>
          {AVAILABLE_ICONS.map((iconName) => {
            const IconRaw = ICON_MAP[iconName];
            const IconAny = IconRaw as any;
            const isSelected = selectedIcon === iconName;

            return (
              <TouchableOpacity 
                key={iconName}
                style={[
                  styles.iconItem, 
                  isSelected && { backgroundColor: category.color, borderColor: category.color }
                ]}
                onPress={() => setSelectedIcon(iconName)}
              >
                <IconAny size={24} color={isSelected ? '#fff' : '#666'} />
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff' },
  backBtn: { padding: 5 },
  title: { fontSize: 20, fontWeight: 'bold', color: THEME.colors.text },
  saveBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.colors.primary, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  saveText: { color: '#fff', fontWeight: 'bold', marginLeft: 5 },
  
  label: { fontSize: 16, fontWeight: 'bold', color: THEME.colors.subtext, marginTop: 20, marginBottom: 5 },
  helper: { fontSize: 12, color: '#999', marginBottom: 10 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 12, fontSize: 18, borderWidth: 1, borderColor: '#ddd', color: THEME.colors.text },
  inputContainer: { flexDirection: 'row', alignItems: 'center' },
  currency: { fontSize: 18, fontWeight: 'bold', marginRight: 10, color: '#999' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  iconItem: { 
    width: '18%', aspectRatio: 1, 
    justifyContent: 'center', alignItems: 'center', 
    backgroundColor: '#fff', borderRadius: 12, margin: '1%',
    borderWidth: 2, borderColor: 'transparent'
  }
});