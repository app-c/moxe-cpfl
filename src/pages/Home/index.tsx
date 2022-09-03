/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, { useCallback } from 'react';
import { Text, Box, FlatList, Center, HStack } from 'native-base';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Fire from '@react-native-firebase/firestore';
import Firestore from '@react-native-firebase/firestore';
import { format } from 'date-fns';
import { Cards } from '../../components/cards';
import { useAuth } from '../../hooks/AuthContext';
import { Lista } from '../../components/Lista';
import theme from '../../global/styles/theme';
import { Fiter } from '../../components/Fiter';
import { colecao } from '../../colecao';
import { ListMaterial } from '../../utils/MaterialList';
import { IReqEpi } from '../../dtos';

interface PropsFicha {
   type: 'epi' | 'ferramenta' | 'ferramenal';
}

export function Home() {
   const hook = useAuth();
   const { colors } = theme;

   const [filtro, setFiltro] = React.useState('todos');
   const [ficha, setFicha] = React.useState('epi');
   const [reqEpi, setReqEpi] = React.useState<IReqEpi[]>([]);
   const [reqFer, setReqFer] = React.useState<IReqEpi[]>([]);

   useFocusEffect(
      useCallback(() => {
         Fire().collection(colecao.USER).doc(hook.user.id).update({
            token: hook.expoToken,
         });
      }, [hook.expoToken, hook.user.id]),
   );

   React.useEffect(() => {
      const lod = Firestore()
         .collection(colecao.REQEPI)
         .onSnapshot(h => {
            const data = h.docs.map(p => p.data() as IReqEpi);

            const res = data.map(h => {
               const data = format(new Date(h.data), 'dd/MM/yy');
               return {
                  ...h,
                  dataFormatada: data,
               };
            });
            setReqEpi(res);
         });

      return () => lod();
   }, []);

   React.useEffect(() => {
      const loa = Firestore()
         .collection(colecao.REQFERRAMENTA)
         .onSnapshot(h => {
            const data = h.docs.map(p => p.data() as IReqEpi);

            const res = data.map(h => {
               const data = format(new Date(h.data), 'dd/MM/yy');
               return {
                  ...h,
                  dataFormatada: data,
               };
            });
            setReqFer(res);
         });

      return () => loa();
   }, []);

   const lista = React.useMemo(() => {
      if (ficha === 'epi') {
         const lsT = reqEpi.filter(h => {
            return h.user_id === hook.user.id;
         });

         const lsP = reqEpi.filter(h => {
            if (h.situacao === 'pendente' && h.user_id === hook.user.id) {
               return h;
            }
         });

         const lsS = reqEpi.filter(h => {
            if (h.situacao === 'em separacao' && h.user_id === hook.user.id) {
               return h;
            }
         });

         const lsE = reqEpi.filter(h => {
            if (h.situacao === 'entregue' && h.user_id === hook.user.id) {
               return h;
            }
         });

         return { lsP, lsE, lsS, lsT };
      }

      if (ficha === 'ferramenta') {
         const lsT = reqFer.filter(h => {
            return h.user_id === hook.user.id;
         });

         const lsP = reqFer.filter(h => {
            if (h.situacao === 'pendente' && h.user_id === hook.user.id) {
               return h;
            }
         });

         const lsS = reqFer.filter(h => {
            if (h.situacao === 'em separacao' && h.user_id === hook.user.id) {
               return h;
            }
         });

         const lsE = reqFer.filter(h => {
            if (h.situacao === 'entregue' && h.user_id === hook.user.id) {
               return h;
            }
         });

         return { lsP, lsE, lsS, lsT };
      }
   }, [ficha, reqEpi, hook.user.id, reqFer]);

   return (
      <Box flex="1">
         <Box p="5">
            <TouchableOpacity
               onPress={() => hook.signOut()}
               style={{
                  width: 50,
                  backgroundColor: colors.green.tom,
                  alignItems: 'center',
                  padding: 4,
                  justifyContent: 'center',
               }}
            >
               <Text>SAIR</Text>
            </TouchableOpacity>
         </Box>

         <Box>
            <ScrollView
               horizontal
               snapToAlignment="start"
               scrollEventThrottle={16}
               decelerationRate="fast"
               snapToOffsets={[0, 150, 160]}
               contentContainerStyle={{
                  paddingRight: 100,
                  paddingLeft: 50,
                  height: 100,
               }}
            >
               <Cards
                  pres={() => setFicha('epi')}
                  presIn={ficha === 'epi'}
                  title="FICHA DE EPIS"
               />
               <Cards
                  presIn={ficha === 'ferramenta'}
                  pres={() => setFicha('ferramenta')}
                  title="FICHA DE FERRAMENTAS"
               />
            </ScrollView>
         </Box>

         <Box p="5">
            <Box>
               <ScrollView horizontal>
                  <HStack space={2}>
                     <Fiter
                        select={() => setFiltro('todos')}
                        active={filtro === 'todos'}
                        text="TODOS PEDIDOS"
                     />
                     <Fiter
                        active={filtro === 'pendente'}
                        text="PEDIDOS PENDENTES"
                        select={() => setFiltro('pendente')}
                     />
                     <Fiter
                        active={filtro === 'em separacao'}
                        select={() => setFiltro('em separacao')}
                        text="PEDIDOS EM SEPARAÇÃO "
                     />
                     <Fiter
                        select={() => setFiltro('entregue')}
                        active={filtro === 'entregue'}
                        text="PEDIDOS ENTREGUE"
                     />
                  </HStack>
               </ScrollView>
            </Box>

            {filtro === 'todos' && (
               <FlatList
                  contentContainerStyle={{
                     paddingBottom: 300,
                  }}
                  data={lista.lsT}
                  renderItem={({ item: h }) => (
                     <Lista
                        data={h.dataFormatada}
                        qnt={h.quantidade}
                        situacao={h.situacao}
                        item={h.item}
                     />
                  )}
               />
            )}

            {filtro === 'pendente' && (
               <FlatList
                  contentContainerStyle={{
                     paddingBottom: 300,
                  }}
                  data={lista.lsP}
                  renderItem={({ item: h }) => (
                     <Lista
                        data={h.dataFormatada}
                        qnt={h.quantidade}
                        situacao={h.situacao}
                        item={h.item}
                     />
                  )}
               />
            )}

            {filtro === 'em separacao' && (
               <Box>
                  <FlatList
                     contentContainerStyle={{
                        paddingBottom: 300,
                     }}
                     data={lista.lsS}
                     renderItem={({ item: h }) => (
                        <Lista
                           data={h.dataFormatada}
                           situacao={h.situacao}
                           item={h.item}
                           qnt={h.quantidade}
                        />
                     )}
                  />
               </Box>
            )}

            {filtro === 'entregue' && (
               <Box>
                  <FlatList
                     data={lista.lsE}
                     renderItem={({ item: h }) => (
                        <Lista
                           data={h.dataFormatada}
                           situacao={h.situacao}
                           item={h.item}
                           qnt={h.quantidade}
                        />
                     )}
                  />
               </Box>
            )}
         </Box>
      </Box>
   );
}
