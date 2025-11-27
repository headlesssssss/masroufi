import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// --- IMPORTS DES ÉCRANS ---
import { DashboardScreen } from '../screens/DashboardScreen';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { HistoryScreen } from '../screens/HistoryScreen';

// --- ICONS & THEME ---
import { LayoutDashboard, PieChart, Settings } from 'lucide-react-native';
import { THEME } from '../constants/categories';

import { CategoryListScreen } from '../screens/CategoryListScreen';
import { EditCategoryScreen } from '../screens/EditCategoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Helper pour contourner le bug TypeScript de React 19 avec Lucide
const TabIcon = ({ icon: Icon, color }: { icon: any, color: string }) => {
  // On force le composant en 'any' pour éviter l'erreur de type
  const IconComponent = Icon as any; 
  return <IconComponent color={color} size={24} />;
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: THEME.colors.primary,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { height: 60, paddingBottom: 10 }
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
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen 
          name="AddTransaction" 
          component={AddTransactionScreen} 
          options={{ presentation: 'modal' }} 
        />
        <Stack.Screen 
          name="CategoryList"
          component={CategoryListScreen}
        />
        <Stack.Screen 
          name="EditCategory"
          component={EditCategoryScreen}
          options={{ presentation: 'modal' }} // Joli effet modal pour l'édition
        />
        <Stack.Screen 
          name="Historique"
          component={HistoryScreen}
          options={{ presentation: 'card', headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};