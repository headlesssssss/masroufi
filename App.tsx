import React from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Import crucial car nous avons supprimé index.ts
import { registerRootComponent } from 'expo';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {/* On affiche toute la navigation de l'application ici */}
      <AppNavigator />
    </SafeAreaProvider>
  );
}

// Cette ligne dit à Expo : "C'est ici que l'application commence !"
registerRootComponent(App);