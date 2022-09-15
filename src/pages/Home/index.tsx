import React from 'react';
import { Text, Box, Input, HStack, ScrollView } from 'native-base';
import Fire from '@react-native-firebase/firestore';
import { Feather } from '@expo/vector-icons';
import { FlatList } from 'react-native';
import { colecao } from '../../colecao';
import { IReqEpi, IReqFerramenta } from '../../dtos';
import { Cards } from '../../components/cards';
import { Lista } from '../../components/Lista';
import { SearchInput } from '../../components/SearchInput';
import { CircleSelect } from '../../components/CircleSelect';
import { Header } from '../../components/Header';
import { useAuth } from '../../hooks/AuthContext';

export function Home() {
   const { user } = useAuth();
   const [search, setSearch] = React.useState('');
   const [dataEpi, setDataEpi] = React.useState<IReqEpi[]>([]);
   const [dataFer, setDataFer] = React.useState<IReqEpi[]>([]);
   const [select, setSelect] = React.useState('pendente');
   const [type, setType] = React.useState('EPI');

   // TODO BUSCAR DO BANCO DE DADOS */
   React.useEffect(() => {
      const lod = Fire()
         .collection(colecao.REQEPI)
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

      return () => lod();
   }, [user.id]);

   React.useEffect(() => {
      const lod = Fire()
         .collection(colecao.REQFERRAMENTA)
         .onSnapshot(data => {
            const dt = data.docs.map(h => h.data() as IReqFerramenta);

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

            setDataFer(up);
         });

      return () => lod();
   }, [user.id]);

   const filEpi = dataEpi.filter(h => select === h.situacao);

   const filFe = dataFer.filter(h => {
      if (h.whoFor === 'PESSOAL' && select === h.situacao) {
         return h;
      }
   });
   const filFer = dataFer.filter(h => {
      if (h.whoFor === 'VEICULO' && h.situacao === select) {
         return h;
      }
   });

   const lista =
      search.length > 0
         ? filEpi.filter(h => {
              return h.material_info.descricao.includes(search);
           })
         : filEpi;

   const ferramenta =
      search.length > 0
         ? filFe.filter(h => {
              return h.material_info.descricao.includes(search);
           })
         : filFe;

   const ferramental =
      search.length > 0
         ? filFer.filter(h => h.material_info.descricao.includes(search))
         : filFer;

   return (
      <Box flex="1">
         <Header text={user.nome} />
         <Box mt="-6" p="10">
            <SearchInput
               text="PESQUISAR ITEM"
               onChangeText={h => setSearch(h)}
               autoCapitalize="characters"
            />
         </Box>
         <HStack mt="-5">
            <ScrollView
               showsHorizontalScrollIndicator={false}
               horizontal
               contentContainerStyle={{ paddingRight: 100 }}
            >
               <Cards
                  pres={() => setType('EPI')}
                  title="EPI"
                  presIn={type === 'EPI'}
               />
               <Cards
                  pres={() => setType('FERRAMENTA')}
                  title="FERRAMENTA"
                  presIn={type === 'FERRAMENTA'}
               />
               <Cards
                  pres={() => setType('FERRAMENTAL')}
                  title="FERRAMENTAL"
                  presIn={type === 'FERRAMENTAL'}
               />
            </ScrollView>
         </HStack>
         <Box mb="5" px="10">
            <HStack justifyContent="space-between" mt="5">
               <CircleSelect
                  pres={() => setSelect('pendente')}
                  selected={select === 'pendente'}
                  text="pendente"
               />
               <CircleSelect
                  pres={() => setSelect('em separacao')}
                  selected={select === 'em separacao'}
                  text="separado"
               />
               <CircleSelect
                  pres={() => setSelect('entregue')}
                  selected={select === 'entregue'}
                  text="entregue"
               />
            </HStack>
         </Box>

         {type === 'EPI' && (
            <FlatList
               contentContainerStyle={{ paddingBottom: 200 }}
               data={lista}
               keyExtractor={h => String(h.data)}
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
         )}
         {type === 'FERRAMENTA' && (
            <FlatList
               contentContainerStyle={{ paddingBottom: 200 }}
               data={ferramenta}
               keyExtractor={h => String(h.data)}
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
         )}
         {type === 'FERRAMENTAL' && (
            <FlatList
               contentContainerStyle={{ paddingBottom: 200 }}
               data={ferramental}
               keyExtractor={h => String(h.data)}
               renderItem={({ item: h }) => (
                  <Box>
                     <Lista
                        data={h.data}
                        item={h.material_info.classificacao}
                        situacao={h.situacao}
                        qnt={h.quantidade}
                     />
                  </Box>
               )}
            />
         )}
      </Box>
   );
}
