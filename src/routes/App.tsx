import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SingUp';
import { AuthApp } from './AuthApp';

const { Navigator, Screen } = createNativeStackNavigator();

export function App() {
   return (
      <Navigator
         screenOptions={{
            headerShown: false,
         }}
      >
         <Screen name="signIn" component={SignIn} />
         <Screen name="home" component={AuthApp} />
      </Navigator>
   );
}
