import Fire from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Box, Center, HStack } from 'native-base';
import React, { useCallback } from 'react';
import { Alert, FlatList, Platform } from 'react-native';
import { colecao } from '../../colecao';
import { CircleSelect } from '../../components/CircleSelect';
import { Header } from '../../components/Header';
import { Lista } from '../../components/Lista';
import { IReqEpi } from '../../dtos';
import { useAuth } from '../../hooks/AuthContext';

export function Home() {
   const { user } = useAuth();
   const [search, setSearch] = React.useState('');
   const [dataEpi, setDataEpi] = React.useState<IReqEpi[]>([]);
   const [select, setSelect] = React.useState('pendente');

   const [dataP, setDataP] = React.useState<IReqEpi[]>([]);
   const [dataS, setDataS] = React.useState<IReqEpi[]>([]);
   const [dataE, setDataE] = React.useState<IReqEpi[]>([]);

   // TODO BUSCAR DO BANCO DE DADOS */
   React.useEffect(() => {
      Fire()
         .collection('pendente')
         .onSnapshot(data => {
            const dt = data.docs.map(h => {
               return {
                  ...h.data(),
                  id: h.id,
               } as IReqEpi;
            });

            setDataP(dt);
         });

      Fire()
         .collection('separado')
         .onSnapshot(data => {
            const dt = data.docs.map(h => {
               return {
                  ...h.data(),
                  id: h.id,
               } as IReqEpi;
            });

            setDataS(dt);
         });

      Fire()
         .collection('entregue')
         .onSnapshot(data => {
            const dt = data.docs.map(h => {
               return {
                  ...h.data(),
                  id: h.id,
               } as IReqEpi;
            });

            setDataE(dt);
         });
   }, []);

   const lista = React.useMemo(() => {
      const p = dataP
         .filter(h => h.user.matricula === user.matricula)
         .sort((a, b) => {
            if (a.data < b.data) {
               return -1;
            }
            return 1;
         });

      const s = dataS
         .filter(h => h.user.matricula === user.matricula)
         .sort((a, b) => {
            if (a.data < b.data) {
               return -1;
            }
            return 1;
         });

      const e = dataE
         .filter(h => h.user.matricula === user.matricula)
         .sort((a, b) => {
            if (a.data < b.data) {
               return -1;
            }
            return 1;
         });

      return { p, s, e };
   }, [dataE, dataP, dataS, user.matricula]);

   const updateToken = React.useCallback(async () => {
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
   }, []);

   useFocusEffect(
      useCallback(() => {
         updateToken();
      }, [updateToken]),
   );

   const detetePedido = React.useCallback((id: string) => {
      Fire()
         .collection('pendente')
         .doc(id)
         .delete()
         .then(() => Alert.alert('Item deletado'));
   }, []);

   return (
      <Box flex="1">
         <Header text={user.nome} />
         <Center mb="5" px="10">
            <HStack justifyContent="space-between" mt="5">
               <CircleSelect
                  pres={() => setSelect('pendente')}
                  selected={select === 'pendente'}
                  text="pendente"
               />
               <CircleSelect
                  pres={() => setSelect('separado')}
                  selected={select === 'separado'}
                  text="separado"
               />
               <CircleSelect
                  pres={() => setSelect('entregue')}
                  selected={select === 'entregue'}
                  text="entregue"
               />
            </HStack>
         </Center>

         {select === 'pendente' && (
            <FlatList
               contentContainerStyle={{ paddingBottom: 200 }}
               data={lista.p}
               keyExtractor={h => String(h.id)}
               renderItem={({ item: h }) => (
                  <Box>
                     <Lista
                        situation="pendente"
                        item={h}
                        showButton="show"
                        del={() => {
                           detetePedido(h.id);
                        }}
                     />
                  </Box>
               )}
            />
         )}

         {select === 'separado' && (
            <FlatList
               contentContainerStyle={{ paddingBottom: 200 }}
               data={lista.s}
               keyExtractor={h => String(h.id)}
               renderItem={({ item: h }) => (
                  <Box>
                     <Lista
                        situation="separado"
                        item={h}
                        del={() => {
                           detetePedido(h.id);
                        }}
                     />
                  </Box>
               )}
            />
         )}

         {select === 'entregue' && (
            <FlatList
               contentContainerStyle={{ paddingBottom: 200 }}
               data={lista.e}
               keyExtractor={h => String(h.id)}
               renderItem={({ item: h }) => (
                  <Box>
                     <Lista
                        situation="entregue"
                        item={h}
                        del={() => {
                           detetePedido(h.id);
                        }}
                     />
                  </Box>
               )}
            />
         )}
      </Box>
   );
}
