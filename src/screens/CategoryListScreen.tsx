import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useStore } from '../store/useStore';
import { THEME } from '../constants/categories';
import { ICON_MAP } from '../constants/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { useThemeColor } from '../hooks/useThemeColor'; // <--- Hook

export const CategoryListScreen = ({ navigation }: any) => {
  const { categories } = useStore();
  const colors = useThemeColor(); // <--- Couleurs

  const BackIcon = ArrowLeft as any;
  const ChevronIcon = ChevronRight as any;
  const expenseCategories = categories.filter(c => parseInt(c.id) < 100);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <BackIcon color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Personnaliser Catégories</Text>
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
              style={[styles.item, { backgroundColor: colors.card }]}
              onPress={() => navigation.navigate('EditCategory', { category: item })}
            >
              <View style={[styles.iconBg, { backgroundColor: item.color + '20' }]}>
                {IconAny && <IconAny size={24} color={item.color} />}
              </View>
              <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
              <ChevronIcon size={20} color={colors.subText} />
            </TouchableOpacity>
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
  item: { flexDirection: 'row', alignItems: 'center', padding: 15, marginBottom: 10, borderRadius: 12 },
  iconBg: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  name: { flex: 1, fontSize: 16, fontWeight: '600' }
});