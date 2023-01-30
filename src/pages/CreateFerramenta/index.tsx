/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
import { Feather } from '@expo/vector-icons';
import Fire from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import * as ImagePicker from 'expo-image-picker';
import {
   Box,
   Button,
   Center,
   CheckIcon,
   HStack,
   Image,
   Select,
   Text,
   VStack,
} from 'native-base';
import React, { useCallback } from 'react';
import {
   ActivityIndicator,
   Alert,
   Dimensions,
   FlatList,
   Modal,
   TouchableOpacity,
} from 'react-native';
import ranhado from '../../assets/ranhado.png';
import { colecao } from '../../colecao';
import { CardItem } from '../../components/CardItem';
import { CircleSelect } from '../../components/CircleSelect';
import { GlobalText } from '../../components/GlobalText';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Itens } from '../../components/Itens';
import { SearchInput } from '../../components/SearchInput';
import { IMaterial, IReqFerramenta, IUser } from '../../dtos';
import theme from '../../global/styles/theme';
import { useAuth } from '../../hooks/AuthContext';
import { materias } from '../../utils/MaterialList';
import { Veiculos } from '../../utils/Veiculos';

interface Props {
   token: string;
}

export function CreateFerramenta() {
   const { user, expoToken } = useAuth();
   const colect = colecao;
   const nav = useNavigation();

   const w = Dimensions.get('window').width;

   const [loading, setLoading] = React.useState(false);

   const [tokenMoxerife, setTokenMoxerife] = React.useState<Props[]>([]);
   const [erro, setErro] = React.useState(false);
   const [messageErrItem, setMessageErrItem] = React.useState('');
   const [errDes, setErrDes] = React.useState(false);
   const [messageErrDes, setMessageErrDes] = React.useState('');
   const [cart, setCart] = React.useState<IReqFerramenta[]>([]);
   const [showModaItens, setModaItens] = React.useState(false);
   const [image, setImage] = React.useState(null);

   const [dataMaterial, setDataMaterial] = React.useState<IMaterial[]>(
      materias.map(h => {
         const up = h.descricao.toUpperCase();
         return {
            ...h,
            descricao: up,
         };
      }),
   );

   const [typeItem, setTypeItem] = React.useState('');
   const [placa, setPlaca] = React.useState('');
   const [modalTypeItem, setModalTypeItem] = React.useState(true);
   const [materialInfo, setInfoMaterial] = React.useState<IMaterial>();

   //* * FORM */
   const [item, setItem] = React.useState('SELECIONE UM ITEM');
   const [descricao, setDescricao] = React.useState('');
   const [qnt, setQnt] = React.useState('');
   const [type, setType] = React.useState('');
   const [imageUrl, setImageUrl] = React.useState('');
   const [car, setCar] = React.useState('');

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

   const dt = new Date();
   const data = format(dt, 'dd/MM/yy');

   const handleAddCart = React.useCallback(() => {
      if (item === 'SELECIONE UM ITEM') {
         return Alert.alert('ALERTA', 'selecione um item para continuar');
      }

      if (descricao.trim() === '' && qnt.trim() === '') {
         setMessageErrDes('descreva o motivo da troca');
         setErro(true);
         setErrDes(true);
         setMessageErrItem('informe a quantidade');
         return;
      }

      if (image === null) {
         return Alert.alert(
            'ATENÇÃO',
            'Favor adicionar uma imagem mostrando a situação do item à ser trocado',
         );
      }

      if (placa.trim() === '' && typeItem === 'VEICULO') {
         return Alert.alert('ATENÇÃO', 'Favor informar a placa');
      }

      if (car === '' && typeItem === 'VEICULO') {
         return Alert.alert('ATENÇÃO', 'Favor informar o número do VEICULO');
      }

      if (typeItem === 'VEICULO') {
         Fire()
            .collection('pedidos')
            .get()
            .then(h => {
               const dt = h.docs.map(h => h.data() as IReqFerramenta);
               const fil = dt.find(h => {
                  if (
                     h.situacao === 'pendente' &&
                     user.id === h.user_info.id &&
                     h.material_info.codigo === materialInfo.codigo &&
                     typeItem === h.whoFor &&
                     h.veiculo === car
                  ) {
                     return h;
                  }
               });

               if (fil) {
                  return Alert.alert(
                     'Atenção',
                     'Você já pediu este item, aguarde a entrega para pedir novamente',
                  );
               }

               if (Number(qnt) > 5) {
                  return Alert.alert(
                     'Erro',
                     'quantidade de pedido dever ser memor que 5 (cinco)',
                  );
               }

               const dados = {
                  data: format(new Date(), 'dd/MM/yy - HH:mm'),
                  description: descricao,
                  qnt: String(qnt),
                  photo: imageUrl,
                  user,
                  item: materialInfo,
                  pushNotification: expoToken,
               };

               const findCart = cart.find(h => {
                  if (h.material_info.descricao === materialInfo.descricao) {
                     return h;
                  }
               });

               if (findCart) {
                  return Alert.alert(
                     'Atenção',
                     'você já adicionou esse material na lista ',
                  );
               }

               setCart([...cart, dados]);
               setType('');
               setItem('SELECIONE UM ITEM');
               setDescricao('');
               setQnt('');
               setImage(null);
            });
      } else {
         Fire()
            .collection('pedidos')
            .get()
            .then(h => {
               const dt = h.docs.map(h => h.data() as IReqFerramenta);
               const fil = dt.find(h => {
                  if (
                     h.situacao === 'pendente' &&
                     user.id === h.user_info.id &&
                     h.material_info.codigo === materialInfo.codigo &&
                     typeItem === h.whoFor
                  ) {
                     return h;
                  }
               });

               if (fil) {
                  return Alert.alert(
                     'Atenção',
                     'Você já pediu este item, aguarde a entrega para pedir novamente',
                  );
               }

               const dados = {
                  whoFor: typeItem,
                  data: format(new Date(), 'dd/MM/yy'),
                  description: descricao,
                  quantidade: qnt,
                  situacao: 'pendente',
                  image: imageUrl,
                  user_info: user,
                  material_info: materialInfo,
                  placa: typeItem === 'VEICULO' ? placa : null,
                  veiculo: car,
               };

               const findCart = cart.find(h => {
                  if (h.material_info.descricao === materialInfo.descricao) {
                     return h;
                  }
               });

               if (findCart) {
                  return Alert.alert(
                     'Atenção',
                     'você já adicionou esse material na lista ',
                  );
               }

               setCart([...cart, dados]);
               setType('');
               setItem('SELECIONE UM ITEM');
               setDescricao('');
               setQnt('');
               setImage(null);
            });
      }
   }, [
      item,
      descricao,
      qnt,
      image,
      placa,
      typeItem,
      car,
      imageUrl,
      user,
      materialInfo,
      cart,
   ]);

   const handleSave = React.useCallback(() => {
      if (cart.length === 0) {
         return Alert.alert('Erro', 'Sua lista está vazia');
      }

      setLoading(true);

      setTimeout(() => {
         cart.forEach(i => {
            Fire().collection('pedidos').add(i);
         });

         setLoading(false);
         nav.navigate('home');
         setCart([]);
      }, 1000);
   }, [cart, nav]);

   const handleSelectItem = React.useCallback((item: IMaterial) => {
      setItem(
         item.descricao === 'NENHUM' ? 'SELECIONE UM ITEM' : item.descricao,
      );
      setInfoMaterial(item);
      setSearch('');
      setModaItens(false);
   }, []);

   //* *SELEC IMAGE */

   const pickImage = React.useCallback(async () => {
      const result = await ImagePicker.launchCameraAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: false,
         aspect: [4, 3],
         quality: 1,
      });

      if (!result.cancelled) {
         setImage(result.uri);

         const fileName = new Date().getTime();
         const reference = storage().ref(`/ferramenta/${fileName}.png`);

         await reference.putFile(result.uri);
         const photoUrl = await reference.getDownloadURL();
         setImageUrl(photoUrl);
      }
   }, []);

   //* * FILTRO DOS EPIS */

   const [search, setSearch] = React.useState('');

   const listaEpis = React.useMemo(() => {
      return dataMaterial.filter(h => h.ft !== 'EPI');
   }, [dataMaterial]);

   const listaFerramentas =
      search.length > 0
         ? listaEpis.filter(h => {
              return h.descricao.includes(search);
           })
         : listaEpis;

   useFocusEffect(
      useCallback(() => {
         setItem('SELECIONE UM ITEM');
         setModalTypeItem(true);
         setErrDes(false);
         setErro(false);
      }, []),
   );

   const top = -w * 0.8;
   return (
      <>
         <Modal visible={modalTypeItem}>
            <Center bg="dark.700" flex={1}>
               <Image
                  resizeMode="contain"
                  size={w * 0.9}
                  mt={top}
                  source={ranhado}
                  alt="image"
               />
               <GlobalText
                  text="ESSA FERRAMENTA É PARA USO: "
                  font="Black"
                  color={theme.colors.blue.tom}
                  size={18}
               />

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
                     selected={typeItem === 'VEICULO'}
                     pres={() => {
                        setTypeItem('VEICULO');
                        setModalTypeItem(false);
                     }}
                     text="VEÍCULO"
                  />
               </HStack>
            </Center>
         </Modal>

         <Header text={`REQUISIÇÃO DE ${'\n'}FERRAMENTAS`} />

         {typeItem === 'PESSOAL' ? (
            <Box>
               <Modal visible={showModaItens}>
                  <Box p="3" flex={1} bg="dark.800">
                     <Box mb="5">
                        <SearchInput
                           text="PEQUISAR ITEM"
                           onChangeText={h => setSearch(h)}
                           autoCapitalize="characters"
                        />
                     </Box>
                     <FlatList
                        data={listaFerramentas}
                        keyExtractor={h => String(h.id)}
                        renderItem={({ item: h }) => (
                           <Itens
                              pres={() => {
                                 handleSelectItem(h);
                                 setType(h.ft);
                              }}
                              item={h.descricao}
                           />
                        )}
                     />
                  </Box>
               </Modal>

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
                     <Box w="110">
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
                        <Center
                           borderRadius="10"
                           p="1"
                           mt="5"
                           bg={theme.colors.yellow.tranparente}
                        >
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
                              <GlobalText text="Adicionar foto" font="Black" />
                           )}
                        </Center>
                     </TouchableOpacity>
                  </VStack>
               </Box>

               <HStack mt="5" justifyContent="space-between" px={5}>
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

                  <Center>
                     {loading ? (
                        <ActivityIndicator />
                     ) : (
                        <Button bg="green.400" onPress={handleSave}>
                           FINALIZAR PEDIDO
                        </Button>
                     )}
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
                           qnt={h.quantidade}
                           description={h.description}
                           item={h.material_info.descricao}
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
                        <SearchInput
                           text="PESQUISAR POR UM ITEM"
                           onChangeText={h => setSearch(h)}
                           autoCapitalize="characters"
                        />
                     </Box>
                     <FlatList
                        data={listaFerramentas}
                        keyExtractor={h => String(h.id)}
                        renderItem={({ item: h }) => (
                           <Itens
                              pres={() => {
                                 handleSelectItem(h);
                                 setType(h.ft);
                              }}
                              item={h.descricao}
                           />
                        )}
                     />
                  </Box>
               </Modal>

               <Box p="5">
                  <VStack>
                     <TouchableOpacity onPress={() => setModaItens(true)}>
                        <Box
                           p="5"
                           borderWidth={1}
                           borderColor="dark.600"
                           borderRadius={25}
                        >
                           <GlobalText text={item} font="bold" />
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
                        <Box w="120">
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
                           <Select
                              selectedValue={car}
                              minWidth="110"
                              accessibilityLabel="Choose Service"
                              placeholder="VEÍCULO"
                              _selectedItem={{
                                 bg: 'teal.600',
                                 endIcon: <CheckIcon size="5" />,
                              }}
                              mt={1}
                              onValueChange={itemValue => setCar(itemValue)}
                           >
                              {Veiculos.map(h => (
                                 <Select.Item label={h.NOME} value={h.NOME} />
                              ))}
                           </Select>
                        </Box>
                     </HStack>

                     <TouchableOpacity onPress={pickImage}>
                        <Center
                           borderRadius="10"
                           p="1"
                           mt="5"
                           bg={theme.colors.yellow.tranparente}
                        >
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
                              <GlobalText text="Adicionar foto" font="Black" />
                           )}
                        </Center>
                     </TouchableOpacity>
                  </VStack>
               </Box>

               <HStack mt="5" justifyContent="space-between" px={5}>
                  <Center>
                     <TouchableOpacity onPress={handleAddCart}>
                        <HStack alignItems="center">
                           <Feather
                              name="plus-circle"
                              size={25}
                              color={theme.colors.orange.tom}
                           />
                           <Center ml="2">
                              <GlobalText
                                 text={`Adicionar item ${'\n'} na lista`}
                                 font="Black"
                                 color={theme.colors.blue.tom}
                                 size={16}
                              />
                           </Center>
                        </HStack>
                     </TouchableOpacity>
                  </Center>

                  <Center>
                     {loading ? (
                        <ActivityIndicator />
                     ) : (
                        <Button bg="green.400" onPress={handleSave}>
                           FINALIZAR PEDIDO
                        </Button>
                     )}
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
                           qnt={h.quantidade}
                           description={h.description}
                           item={h.material_info.descricao}
                        />
                     </Box>
                  )}
               />
            </Box>
         )}
      </>
   );
}
