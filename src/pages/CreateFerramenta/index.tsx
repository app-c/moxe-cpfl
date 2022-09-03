/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
import React, { useCallback } from 'react';
import { Text, Box, Center, VStack, Button, HStack, Image } from 'native-base';
import Fire from '@react-native-firebase/firestore';
import {
   Alert,
   FlatList,
   Modal,
   ScrollView,
   TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import storage from '@react-native-firebase/storage';
import { Input } from '../../components/Input';
import { useAuth } from '../../hooks/AuthContext';
import { colecao } from '../../colecao';
import { IUser } from '../../dtos';
import { CardItem } from '../../components/CardItem';
import { ListMaterial } from '../../utils/MaterialList';
import { Itens } from '../../components/Itens';
import { CircleSelect } from '../../components/CircleSelect';

interface Props {
   token: string;
}

interface PropsList {
   item: string;
   id: string;
   type: string;
}

interface PropsItens {
   item: string;
   id?: string;
   type: string;
   image: string;
   qnt: string;
   data: number;
   situacao: string;
   descricao: string;
   user_id: string;
   nome: string;
   token: string;
}

interface EpisPros {
   codig: string;
   item: string;
   type: string;
   ged: string;
   ft: string;
   index: number;
}

export function CreateFerramenta() {
   const { user, expoToken } = useAuth();
   const colect = colecao;
   const nav = useNavigation();

   const [tokenMoxerife, setTokenMoxerife] = React.useState<Props[]>([]);
   const [erro, setErro] = React.useState(false);
   const [messageErrItem, setMessageErrItem] = React.useState('');
   const [errDes, setErrDes] = React.useState(false);
   const [messageErrDes, setMessageErrDes] = React.useState('');
   const [cart, setCart] = React.useState<PropsItens[]>([]);
   const [showModaItens, setModaItens] = React.useState(false);
   const [image, setImage] = React.useState(null);
   const [epis, setEpis] = React.useState<EpisPros[]>([]);
   const [typeItem, setTypeItem] = React.useState('');
   const [placa, setPlaca] = React.useState('');
   const [modalTypeItem, setModalTypeItem] = React.useState(true);

   //* * FORM */
   const [item, setItem] = React.useState('SELECIONE UM ITEM');
   const [descricao, setDescricao] = React.useState('');
   const [qnt, setQnt] = React.useState('');
   const [type, setType] = React.useState('');
   const [imageUrl, setImageUrl] = React.useState('');
   const [car, setCar] = React.useState<number>(0);

   React.useEffect(() => {
      Fire()
         .collection(colecao.MOXERIFE)
         .get()
         .then(mox => {
            const moxe = mox.docs.map(h => h.data() as IUser);
            setTokenMoxerife(
               moxe.map(h => {
                  return { token: h.token };
               }),
            );
         });
   }, []);

   const handleSubmit = React.useCallback(async () => {
      if (cart.length > 0) {
         for (let i = 0; i < cart.length; i += 1) {
            const dados = {
               item: cart[i].item,
               data: new Date().getTime(),
               situacao: 'pendente',
               descricao: cart[i].descricao,
               user_id: user.id,
               nome: user.nome,
               token: expoToken,
               quantidade: qnt,
               image: imageUrl,
               tipo_item: typeItem,
               placa: typeItem === 'CAMINHÃO' ? placa : 0,
            };

            Fire()
               .collection(colect.REQFERRAMENTA)
               .add(dados)
               .then(() => {
                  Alert.alert('Sucesso!', 'Aguarde a separaçao do seu pedido');
                  nav.navigate('home');
               });

            for (let i = 0; i < tokenMoxerife.length; i += 1) {
               const message = {
                  to: tokenMoxerife[i].token,
                  sound: 'default',
                  title: 'NOVA REQUISIÇÃO DE EPI',
                  body: `Colaborador ${user.nome} fez uma socilicitação do item: ${dados.item}`,
               };

               await fetch('https://exp.host/--/api/v2/push/send', {
                  method: 'POST',
                  headers: {
                     Accept: 'application/json',
                     'Accept-encoding': 'gzip, deflate',
                     'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(message),
               });
            }
         }
      } else {
         if (descricao && qnt) {
            setErro(false);
            setErrDes(false);
         }
         if (descricao.trim() === '' && qnt.trim() === '') {
            setErro(true);
            setErrDes(true);
            setMessageErrDes('descreva o motivo da troca');
            setMessageErrItem('informe a quantidade');
            return;
         }

         if (item === 'SELECIONE UM ITEM') {
            return Alert.alert('ALERTA', 'selecione um item para continuar');
         }

         if (image === null) {
            return Alert.alert(
               'ATENÇÃO',
               'Favor adicionar uma imagem mostrando a situação do item à ser trocado',
            );
         }

         if (placa.trim() === '' && typeItem === 'CAMINHÃO') {
            return Alert.alert('ATENÇÃO', 'Favor informar a placa');
         }

         const dados = {
            item,
            data: new Date().getTime(),
            situacao: 'pendente',
            descricao,
            user_id: user.id,
            nome: user.nome,
            token: expoToken,
            image: imageUrl,
            quantidade: qnt,
            tipo_item: typeItem,
            placa: typeItem === 'CAMINHÃO' ? placa : 0,
         };

         Fire()
            .collection(colect.REQFERRAMENTA)
            .add(dados)
            .then(() => {
               Alert.alert('Sucesso!', 'Aguarde a separaçao do seu pedido');
               nav.navigate('home');
            });

         for (let i = 0; i < tokenMoxerife.length; i += 1) {
            const message = {
               to: tokenMoxerife[i].token,
               sound: 'default',
               title: 'NOVA REQUISIÇÃO DE EPI',
               body: `Colaborador ${user.nome} fez uma socilicitação do item: ${dados.item}`,
            };

            await fetch('https://exp.host/--/api/v2/push/send', {
               method: 'POST',
               headers: {
                  Accept: 'application/json',
                  'Accept-encoding': 'gzip, deflate',
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify(message),
            });
         }
      }

      setType('');
      setItem('SELECIONE UM ITEM');
      setDescricao('');
      setQnt('');
      setImage(null);
   }, [
      cart,
      colect.REQFERRAMENTA,
      descricao,
      expoToken,
      image,
      imageUrl,
      item,
      nav,
      placa,
      qnt,
      tokenMoxerife,
      typeItem,
      user.id,
      user.nome,
   ]);

   const handleAddCart = React.useCallback(() => {
      if (item === 'SELECIONE UM ITEM') {
         return Alert.alert('ALERTA', 'selecione um item para continuar');
      }

      if (descricao.trim() === '' && qnt.trim() === '') {
         setErro(true);
         setErrDes(true);
         setMessageErrDes('descreva o motivo da troca');
         setMessageErrItem('informe a quantidade');
         return;
      }

      if (image === null) {
         return Alert.alert(
            'ATENÇÃO',
            'Favor adicionar uma imagem mostrando a situação do item à ser trocado',
         );
      }

      if (placa.trim() === '') {
         return Alert.alert('ATENÇÃO', 'Favor informar a placa');
      }

      if (car === 0 && typeItem === 'CAMINHÃO') {
         return Alert.alert('ATENÇÃO', 'Favor informar o número do caminhão');
      }

      const dados = {
         type,
         item,
         data: new Date().getTime(),
         situacao: 'pendente',
         descricao,
         user_id: user.id,
         nome: user.nome,
         token: expoToken,
         image,
         qnt,
         tipo_item: typeItem,
         placa: typeItem === 'CAMINHÃO' ? placa : 0,
         car,
      };

      setType('');
      setItem('SELECIONE UM ITEM');
      setDescricao('');
      setQnt('');
      setImage(null);

      setCart([...cart, dados]);
   }, [
      cart,
      descricao,
      expoToken,
      car,
      image,
      item,
      placa,
      qnt,
      type,
      typeItem,
      user.id,
      user.nome,
   ]);

   const handleSelectItem = React.useCallback((item: string) => {
      setItem(item === 'NENHUM' ? 'SELECIONE UM ITEM' : item);
      setSearch('');
      setModaItens(false);
   }, []);

   //* *SELEC IMAGE */

   const pickImage = React.useCallback(async () => {
      const result = await ImagePicker.launchCameraAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
      });

      if (!result.cancelled) {
         setImage(result.uri);

         const fileName = new Date().getTime();
         const reference = storage().ref(`/epi/${fileName}.png`);

         await reference.putFile(result.uri);
         const photoUrl = await reference.getDownloadURL();
         setImageUrl(photoUrl);
      }
   }, []);

   //* * FILTRO DOS EPIS */

   const [search, setSearch] = React.useState('');

   const listaEpis = React.useMemo(() => {
      return epis.filter(h => h.type !== 'EPI');
   }, [epis]);

   const materiais =
      search.length > 0
         ? listaEpis.filter(h => {
              return h.item.includes(search);
           })
         : listaEpis;

   useFocusEffect(
      useCallback(() => {
         const li = [];
         setModalTypeItem(true);
         setErro(false);
         setErrDes(false);

         for (let i = 0; i < ListMaterial.length; i += 1) {
            const [codigo, item, ig] = ListMaterial[i][
               'C�DIGO;DESCRIÇAO;CLASSIFICAÇAO CONTAB�L;VALOR;GED;FT;ITEM'
            ]
               .split(';')
               .map(String);

            const [ged, ft, type, ignore] =
               ListMaterial[i].Column2.split(';').map(String);

            const dados = {
               codig: codigo,
               item,
               type,
               ged,
               ft,
               index: i,
            };

            li.push(dados);
         }
         setEpis(li);
      }, []),
   );

   return (
      <>
         <Modal visible={modalTypeItem}>
            <Center flex={1}>
               <Text>ESSA FERRAMENTA É PARA USO:</Text>

               <HStack space={10} mt="10">
                  <CircleSelect
                     selected={typeItem === 'PESSOAL'}
                     pres={() => {
                        setTypeItem('PESSOAL');
                        setModalTypeItem(false);
                     }}
                     text="PESSOAL"
                  />

                  <CircleSelect
                     selected={typeItem === 'CAMINHÃO'}
                     pres={() => {
                        setTypeItem('CAMINHÃO');
                        setModalTypeItem(false);
                     }}
                     text="CAMINHÃO"
                  />
               </HStack>
            </Center>
         </Modal>
         {typeItem === 'PESSOAL' ? (
            <Box>
               <Modal visible={showModaItens}>
                  <Box p="3" flex={1} bg="dark.800">
                     <Box mb="5">
                        <Input
                           value={search}
                           error={errDes}
                           erroMessage=""
                           onChangeText={h => setSearch(h)}
                           label="DESCRIÇAO"
                           title="PESQUISAR POR UM ITEM"
                           text="descricao não pode ficar em branco"
                           autoCapitalize="characters"
                        />
                     </Box>
                     <FlatList
                        data={materiais}
                        keyExtractor={h => String(h.index)}
                        renderItem={({ item: h }) => (
                           <Itens
                              key={h.index}
                              pres={() => {
                                 handleSelectItem(h.item);
                                 setType(h.type);
                              }}
                              item={h.item}
                           />
                        )}
                     />
                  </Box>
               </Modal>
               <Center mt="5">
                  <Text>REQUISIÇÃO DE FERRAMENTAS</Text>
               </Center>

               <Box p="5">
                  <VStack>
                     <TouchableOpacity onPress={() => setModaItens(true)}>
                        <Box
                           p="5"
                           borderWidth={1}
                           borderColor="dark.600"
                           borderRadius={25}
                        >
                           <Text>{item}</Text>
                        </Box>
                     </TouchableOpacity>

                     <Input
                        value={descricao}
                        error={errDes}
                        erroMessage={messageErrDes}
                        onChangeText={h => setDescricao(h)}
                        label="DESCRIÇAO"
                        title="Descreva o motivo do pedido"
                        text="descricao não pode ficar em branco"
                     />
                     <Box w="100">
                        <Input
                           keyboardType="numeric"
                           value={qnt}
                           error={errDes}
                           erroMessage={messageErrItem}
                           onChangeText={h => setQnt(h)}
                           label="QUANTIDADE"
                           title="QUANTIDADE"
                           text="descricao não pode ficar em branco"
                        />
                     </Box>

                     <TouchableOpacity onPress={pickImage}>
                        <Center w="110" p="1" mt="5" bg="dark.700">
                           {image ? (
                              <Box>
                                 <Image
                                    source={{ uri: image }}
                                    resizeMode="contain"
                                    size="20"
                                    alt="foto"
                                 />
                              </Box>
                           ) : (
                              <Text>Adicionar foto</Text>
                           )}
                        </Center>
                     </TouchableOpacity>
                  </VStack>
               </Box>

               <HStack mt="5" justifyContent="space-between" px={5}>
                  <Center>
                     <Button bg="green.400" onPress={handleSubmit}>
                        FINALIZAR PEDIDO
                     </Button>
                  </Center>

                  <Center>
                     <TouchableOpacity onPress={handleAddCart}>
                        <HStack alignItems="center">
                           <Feather name="plus-circle" size={20} />
                           <Text alignSelf="center" ml="1">
                              adicionar item {'\n'} na lista
                           </Text>
                        </HStack>
                     </TouchableOpacity>
                  </Center>
               </HStack>

               <FlatList
                  style={{ marginLeft: 15 }}
                  contentContainerStyle={{ paddingBottom: 500 }}
                  data={cart}
                  keyExtractor={h => String(h.data)}
                  renderItem={({ item: h }) => (
                     <Box mt="5">
                        <CardItem
                           qnt={h.qnt}
                           description={h.descricao}
                           item={h.item}
                        />
                     </Box>
                  )}
               />
            </Box>
         ) : (
            <Box>
               <Modal visible={showModaItens}>
                  <Box p="3" flex={1} bg="dark.800">
                     <Box mb="5">
                        <Input
                           value={search}
                           error={errDes}
                           erroMessage=""
                           onChangeText={h => setSearch(h)}
                           label="DESCRIÇAO"
                           title="PESQUISAR POR UM ITEM"
                           text="descricao não pode ficar em branco"
                           autoCapitalize="characters"
                        />
                     </Box>
                     <FlatList
                        data={materiais}
                        keyExtractor={h => String(h.index)}
                        renderItem={({ item: h }) => (
                           <Itens
                              key={h.index}
                              pres={() => {
                                 handleSelectItem(h.item);
                                 setType(h.type);
                              }}
                              item={h.item}
                           />
                        )}
                     />
                  </Box>
               </Modal>
               <Center mt="5">
                  <Text>REQUISIÇÃO DE FERRAMENTAS</Text>
               </Center>

               <Box p="5">
                  <VStack>
                     <TouchableOpacity onPress={() => setModaItens(true)}>
                        <Box
                           p="5"
                           borderWidth={1}
                           borderColor="dark.600"
                           borderRadius={25}
                        >
                           <Text>{item}</Text>
                        </Box>
                     </TouchableOpacity>

                     <Input
                        value={descricao}
                        error={errDes}
                        erroMessage={messageErrDes}
                        onChangeText={h => setDescricao(h)}
                        label="DESCRIÇAO"
                        title="Descreva o motivo do pedido"
                        text="descricao não pode ficar em branco"
                     />

                     <HStack space="5">
                        <Box w="100">
                           <Input
                              keyboardType="numeric"
                              value={qnt}
                              error={errDes}
                              erroMessage={messageErrItem}
                              onChangeText={h => setQnt(h)}
                              label="QUANTIDADE"
                              title="QUANTIDADE"
                              text="descricao não pode ficar em branco"
                           />
                        </Box>

                        <Box w="100">
                           <Input
                              keyboardType="ascii-capable"
                              autoCapitalize="characters"
                              value={placa}
                              error={errDes}
                              erroMessage={messageErrItem}
                              onChangeText={h => setPlaca(h)}
                              label="QUANTIDADE"
                              title="PLACA"
                              text="descricao não pode ficar em branco"
                           />
                        </Box>

                        <Box w="100">
                           <Input
                              keyboardType="ascii-capable"
                              autoCapitalize="characters"
                              error={errDes}
                              erroMessage={messageErrItem}
                              onChangeText={h => setCar(Number(h))}
                              label="QUANTIDADE"
                              title="car"
                              text="descricao não pode ficar em branco"
                           />
                        </Box>
                     </HStack>

                     <TouchableOpacity onPress={pickImage}>
                        <Center w="110" p="1" mt="5" bg="dark.700">
                           {image ? (
                              <Box>
                                 <Image
                                    source={{ uri: image }}
                                    resizeMode="contain"
                                    size="20"
                                    alt="foto"
                                 />
                              </Box>
                           ) : (
                              <Text>Adicionar foto</Text>
                           )}
                        </Center>
                     </TouchableOpacity>
                  </VStack>
               </Box>

               <HStack mt="5" justifyContent="space-between" px={5}>
                  <Center>
                     <Button bg="green.400" onPress={handleSubmit}>
                        FINALIZAR PEDIDO
                     </Button>
                  </Center>

                  <Center>
                     <TouchableOpacity onPress={handleAddCart}>
                        <HStack alignItems="center">
                           <Feather name="plus-circle" size={20} />
                           <Text alignSelf="center" ml="1">
                              adicionar item {'\n'} na lista
                           </Text>
                        </HStack>
                     </TouchableOpacity>
                  </Center>
               </HStack>

               <FlatList
                  style={{ marginLeft: 15 }}
                  contentContainerStyle={{ paddingBottom: 500 }}
                  data={cart}
                  keyExtractor={h => String(h.data)}
                  renderItem={({ item: h }) => (
                     <Box mt="5">
                        <CardItem
                           qnt={h.qnt}
                           description={h.descricao}
                           item={h.item}
                        />
                     </Box>
                  )}
               />
            </Box>
         )}
      </>
   );
}
