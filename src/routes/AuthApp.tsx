import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { Home } from '../pages/Home';
import { CreateEpi } from '../pages/CreateEpi';
import theme from '../global/styles/theme';
import { CreateFerramenta } from '../pages/CreateFerramenta';

const { colors } = theme;

const { Navigator, Screen } = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigation() {
   return (
      <Tab.Navigator
         screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: 'blue',
            tabBarStyle: {
               paddingBottom: 4,
               paddingTop: 4,
               height: 60,
               backgroundColor: '#fff',
            },
            tabBarLabelStyle: {
               fontSize: 14,
               textAlign: 'center',
               width: 100,
            },
         }}
      >
         <Tab.Screen
            name="home"
            component={Home}
            options={{
               tabBarIcon: ({ color, size }) => (
                  <Entypo name="home" size={size} color={color} />
               ),
            }}
         />

         <Tab.Screen
            name="PEDIR EPI"
            component={CreateEpi}
            options={{
               tabBarIcon: ({ color, size }) => (
                  <Entypo name="hand" size={size} color={color} />
               ),
            }}
         />

         <Tab.Screen
            name="PEDIR FERRAMENTA"
            component={CreateFerramenta}
            options={{
               tabBarIcon: ({ color, size }) => (
                  <FontAwesome5 name="uikit" size={size} color={color} />
               ),
            }}
         />
      </Tab.Navigator>
   );
}

export function AuthApp() {
   return (
      <Navigator
         screenOptions={{
            headerShown: false,
         }}
      >
         <Screen name="home" component={TabNavigation} />
      </Navigator>
   );
}
