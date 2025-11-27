import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Platform } from 'react-native';
// 1. Import de l'outil de calcul automatique
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Imports Écrans
import { DashboardScreen } from '../screens/DashboardScreen';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { CategoryListScreen } from '../screens/CategoryListScreen';
import { EditCategoryScreen } from '../screens/EditCategoryScreen';

import { LayoutDashboard, PieChart, Settings } from 'lucide-react-native';
import { THEME } from '../constants/categories';
import { useThemeColor } from '../hooks/useThemeColor';
import { useStore } from '../store/useStore';

import { RecurringListScreen } from '../screens/RecurringListScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabIcon = ({ icon: Icon, color }: { icon: any, color: string }) => {
  const IconComponent = Icon as any; 
  return <IconComponent color={color} size={24} />;
};

function TabNavigator() {
  const colors = useThemeColor();
  // 2. On récupère les dimensions exactes de la "zone de danger" du téléphone
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: THEME.colors.primary,
        tabBarInactiveTintColor: colors.subText,
        tabBarStyle: { 
          // 3. Calcul automatique de la hauteur
          // Base (65) + Zone Système (insets.bottom) + Marge (10)
          height: 65 + insets.bottom + 10, 
          
          // Le padding du bas correspond exactement à la zone système + un peu d'espace
          paddingBottom: insets.bottom + 10, 
          paddingTop: 12,
          
          backgroundColor: colors.card,
          borderTopWidth: 0,
          borderTopColor: colors.border,
          
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        }
      }}
    >
      <Tab.Screen 
        name="Accueil" 
        component={DashboardScreen} 
        options={{ 
          tabBarIcon: ({ color }) => <TabIcon icon={LayoutDashboard} color={color} />
        }}
      />
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen}
        options={{ 
          tabBarIcon: ({ color }) => <TabIcon icon={PieChart} color={color} />
        }}
      />
      <Tab.Screen 
        name="Réglages" 
        component={SettingsScreen} 
        options={{ 
          tabBarIcon: ({ color }) => <TabIcon icon={Settings} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}

export const AppNavigator = () => {
  const { isDarkMode } = useStore();

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen 
          name="AddTransaction" 
          component={AddTransactionScreen} 
          options={{ presentation: 'modal' }} 
        />
        <Stack.Screen 
          name="Historique"
          component={HistoryScreen}
          options={{ presentation: 'card', headerShown: false }} 
        />
        <Stack.Screen 
          name="CategoryList"
          component={CategoryListScreen}
        />
        <Stack.Screen 
          name="EditCategory"
          component={EditCategoryScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen 
          name="RecurringList"
          component={RecurringListScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};