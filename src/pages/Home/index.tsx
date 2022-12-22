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

   // TODO BUSCAR DO BANCO DE DADOS */
   React.useEffect(() => {
      Fire()
         .collection(colecao.solicitacao)
         .onSnapshot(data => {
            const dt = data.docs.map(h => h.data() as IReqEpi);

            const up = dt
               .map(h => {
                  const cs = h.material_info.descricao.toUpperCase();

                  return {
                     ...h,
                     material_info: {
                        ...h.material_info,
                        descricao: cs,
                     },
                  };
               })
               .filter(h => h.user_info.id === user.id);

            setDataEpi(up);
         });
   }, [user.id]);

   const filEpi = dataEpi.filter(h => select === h.situacao);

   const lista =
      search.length > 0
         ? filEpi.filter(h => {
              return h.material_info.descricao.includes(search);
           })
         : filEpi;

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

      Fire().collection(colecao.USER).doc(user.id).update({
         token,
      });
   }, [user]);

   useFocusEffect(
      useCallback(() => {
         updateToken();
      }, [updateToken]),
   );

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

         <FlatList
            contentContainerStyle={{ paddingBottom: 200 }}
            data={filEpi}
            keyExtractor={h => String(h.id)}
            renderItem={({ item: h }) => (
               <Box>
                  <Lista
                     data={h.data}
                     item={h.material_info.descricao}
                     situacao={h.situacao}
                     qnt={h.quantidade}
                  />
               </Box>
            )}
         />
      </Box>
   );
}
