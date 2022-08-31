import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import AppProvider from './src/hooks';
import { Routes } from './src/routes';

export default function App() {
   return (
      <NavigationContainer>
         <AppProvider>
            <NativeBaseProvider>
               <View style={{ flex: 1 }}>
                  <Routes />
               </View>
            </NativeBaseProvider>
         </AppProvider>
      </NavigationContainer>
   );
}
