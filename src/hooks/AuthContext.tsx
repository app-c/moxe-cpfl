/* eslint-disable consistent-return */
/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
   createContext,
   useCallback,
   useContext,
   useEffect,
   useState,
} from 'react';
import { Alert, Platform } from 'react-native';
import Auth from '@react-native-firebase/auth';
import Firestore from '@react-native-firebase/firestore';

import { format } from 'date-fns';
import * as Notifications from 'expo-notifications';
import { IUser } from '../dtos';
import { colecao } from '../colecao';

interface SignInCred {
   email: string;
   senha: string;
}

interface AuthContexData {
   user: IUser | null;
   expoToken: string;
   loading: boolean;
   signIn(credential: SignInCred): Promise<void>;
   signOut(): void;
   updateUser(user: IUser): Promise<void>;
}

interface EpisPros {
   codig: string;
   item: string;
   type: string;
   ged: string;
   ft: string;
   index: number;
}
const User_Collection = '@Req:user';

export const AuthContext = createContext<AuthContexData>({} as AuthContexData);

export const AuthProvider: React.FC = ({ children }) => {
   const { USER, REQFERRAMENTA } = colecao;

   const [loading, setLoading] = useState(true);
   const [user, setUser] = useState<IUser | null>(null);

   const [epis, setEpis] = React.useState<EpisPros[]>([]);

   const [expoToken, setExpotoken] = React.useState('');

   const LoadingUser = useCallback(async () => {
      setLoading(true);

      const storeUser = await AsyncStorage.getItem(User_Collection);

      if (storeUser) {
         const userData = JSON.parse(storeUser) as IUser;
         setUser(userData);
      }

      setLoading(false);
   }, []);

   useEffect(() => {
      LoadingUser();
   }, [LoadingUser]);

   const signIn = useCallback(
      async ({ email, senha }) => {
         await Auth()
            .signInWithEmailAndPassword(email, senha)
            .then(au => {
               Firestore()
                  .collection(USER)
                  .doc(au.user.uid)
                  .get()
                  .then(async profile => {
                     const { nome, matricula, city, token } =
                        profile.data() as IUser;

                     if (profile.exists) {
                        const userData = {
                           email: au.user.email,
                           id: au.user.uid,
                           nome,
                           city,
                           matricula,
                           token,
                        };
                        await AsyncStorage.setItem(
                           User_Collection,
                           JSON.stringify(userData),
                        );
                        setUser(userData);
                     }
                  })
                  .catch(err => {
                     const { code } = err;
                     Alert.alert(
                        'Login',
                        'Não foi possível carregar os dados do usuário',
                     );
                  });
            });
         // .catch(h => console.log(h.code));
      },
      [USER],
   );

   //* ORDERS.................................................................

   //* .......................................................................

   const signOut = useCallback(async () => {
      await AsyncStorage.removeItem(User_Collection);

      setUser(null);
   }, []);

   const updateUser = useCallback(async (user: IUser) => {
      await AsyncStorage.setItem(User_Collection, JSON.stringify(user));

      setUser(user);
   }, []);

   const Token = React.useCallback(async () => {
      const { status: existingStatus } =
         await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
         const { status } = await Notifications.requestPermissionsAsync();
         finalStatus = status;
      }
      if (finalStatus !== 'granted') {
         Alert.alert('Failed to get push token for push notification!');
         return;
      }
      const token = (
         await Notifications.getExpoPushTokenAsync({
            experienceId: '@app-c/requisicao',
         })
      ).data;

      if (Platform.OS === 'android') {
         Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
         });
      }

      setExpotoken(token);
   }, []);

   React.useEffect(() => {
      Token();
   }, [Token]);

   return (
      <AuthContext.Provider
         value={{
            user,
            loading,
            signIn,
            signOut,
            updateUser,
            expoToken,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};

export function useAuth(): AuthContexData {
   const context = useContext(AuthContext);

   if (!context) {
      throw new Error('useAuth must be used with ..');
   }

   return context;
}
