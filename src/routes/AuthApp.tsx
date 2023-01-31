import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import theme from '../global/styles/theme';
import { CreateEpi } from '../pages/CreateEpi';
import { CreateFerramenta } from '../pages/CreateFerramenta';
import { Home } from '../pages/Home';

const { colors } = theme;

const { Navigator, Screen } = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigation() {
   return (
      <Tab.Navigator
         screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: theme.colors.orange.tom,
            tabBarStyle: {
               paddingBottom: 4,
               paddingTop: 4,
               height: 60,
               backgroundColor: theme.colors.blue.tom,
            },
            tabBarLabelStyle: {
               fontSize: 14,
               textAlign: 'center',
               width: 110,
               fontFamily: 'Black',
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
            name="PEDIR EPI / FERRAMENTA"
            component={CreateEpi}
            options={{
               tabBarIcon: ({ color, size }) => (
                  <Entypo name="hand" size={size} color={color} />
               ),
            }}
         />
         {/* 
         <Tab.Screen
            name="PEDIR FERRAMENTA"
            component={CreateFerramenta}
            options={{
               tabBarIcon: ({ color, size }) => (
                  <FontAwesome5 name="uikit" size={size} color={color} />
               ),
            }}
         /> */}
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
         <Screen name="homeA" component={TabNavigation} />
      </Navigator>
   );
}
