import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useStore } from '../store/useStore';
import { THEME } from '../constants/categories';
import { ICON_MAP, AVAILABLE_ICONS } from '../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useThemeColor } from '../hooks/useThemeColor'; // <--- Hook

export const EditCategoryScreen = ({ navigation, route }: any) => {
  const { category } = route.params;
  const { updateCategory } = useStore();
  const colors = useThemeColor(); // <--- Couleurs
  
  const [name, setName] = useState(category.name);
  const [selectedIcon, setSelectedIcon] = useState(category.icon);
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
      budgetLimit: limit ? parseFloat(limit) : undefined
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <BackIcon color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Modifier</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
           <SaveIcon color="#fff" size={20} />
           <Text style={styles.saveText}>OK</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        <Text style={styles.label}>Nom de la catégorie</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.subText}
        />

        <Text style={styles.label}>Budget mensuel limite (Optionnel)</Text>
        <Text style={styles.helper}>Recevez une alerte si vous dépassez ce montant.</Text>
        <View style={styles.inputContainer}>
            <Text style={styles.currency}>DH</Text>
            <TextInput 
              style={[styles.input, { flex: 1, backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
              value={limit}
              onChangeText={setLimit}
              placeholder="Ex: 2000"
              placeholderTextColor={colors.subText}
              keyboardType="numeric"
            />
        </View>

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
                  { backgroundColor: colors.card },
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
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backBtn: { padding: 5 },
  title: { fontSize: 20, fontWeight: 'bold' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.colors.primary, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  saveText: { color: '#fff', fontWeight: 'bold', marginLeft: 5 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#999', marginTop: 20, marginBottom: 5 },
  helper: { fontSize: 12, color: '#999', marginBottom: 10 },
  input: { padding: 15, borderRadius: 12, fontSize: 18, borderWidth: 1 },
  inputContainer: { flexDirection: 'row', alignItems: 'center' },
  currency: { fontSize: 18, fontWeight: 'bold', marginRight: 10, color: '#999' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  iconItem: { 
    width: '18%', aspectRatio: 1, 
    justifyContent: 'center', alignItems: 'center', 
    borderRadius: 12, margin: '1%',
    borderWidth: 2, borderColor: 'transparent'
  }
});