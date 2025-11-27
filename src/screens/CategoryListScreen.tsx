import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useStore } from '../store/useStore';
import { THEME } from '../constants/categories';
import { ICON_MAP } from '../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';

export const CategoryListScreen = ({ navigation }: any) => {
  const { categories } = useStore();
  const BackIcon = ArrowLeft as any;
  const ChevronIcon = ChevronRight as any;

  // On sépare les dépenses pour l'affichage (les revenus sont rarement modifiés mais on les laisse si besoin)
  const expenseCategories = categories.filter(c => parseInt(c.id) < 100);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <BackIcon color={THEME.colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Personnaliser Catégories</Text>
      </View>

      <FlatList
        data={expenseCategories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => {
          const IconRaw = ICON_MAP[item.icon];
          const IconAny = IconRaw as any;

          return (
            <TouchableOpacity 
              style={styles.item}
              onPress={() => navigation.navigate('EditCategory', { category: item })}
            >
              <View style={[styles.iconBg, { backgroundColor: item.color + '20' }]}>
                {IconAny && <IconAny size={24} color={item.color} />}
              </View>
              <Text style={styles.name}>{item.name}</Text>
              <ChevronIcon size={20} color="#ccc" />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  backBtn: { marginRight: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: THEME.colors.text },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 12 },
  iconBg: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  name: { flex: 1, fontSize: 16, fontWeight: '600', color: THEME.colors.text }
});