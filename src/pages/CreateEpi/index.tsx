/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
import React, { useCallback } from 'react';
import { Text, Box, Center, VStack, Button, HStack, Image } from 'native-base';
import Fire from '@react-native-firebase/firestore';
import { Alert, FlatList, Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import storage from '@react-native-firebase/storage';
import { format } from 'date-fns';
import { Input } from '../../components/Input';
import { useAuth } from '../../hooks/AuthContext';
import { colecao } from '../../colecao';
import { IMaterial, IReqEpi, IUser } from '../../dtos';
import { CardItem } from '../../components/CardItem';
import { materias } from '../../utils/MaterialList';
import { Itens } from '../../components/Itens';
import { Header } from '../../components/Header';
import { GlobalText } from '../../components/GlobalText';
import theme from '../../global/styles/theme';
import { SearchInput } from '../../components/SearchInput';

interface Props {
   token: string;
}

export function CreateEpi() {
   const { user, expoToken } = useAuth();
   const colect = colecao;
   const nav = useNavigation();

   const [tokenMoxerife, setTokenMoxerife] = React.useState<Props[]>([]);
   const [erro, setErro] = React.useState(false);
   const [messageErrItem, setMessageErrItem] = React.useState('');
   const [errDes, setErrDes] = React.useState(false);
   const [messageErrDes, setMessageErrDes] = React.useState('');
   const [cart, setCart] = React.useState<IReqEpi[]>([]);
   const [showModaItens, setModaItens] = React.useState(false);
   const [image, setImage] = React.useState(null);
   const [dataMaterial, setMaterial] = React.useState<IMaterial[]>(materias);
   const [materialInfo, setMaterialInfo] = React.useState<IMaterial>();

   //* * FORM */
   const [item, setItem] = React.useState('SELECIONE UM ITEM');
   const [descricao, setDescricao] = React.useState('');
   const [qnt, setQnt] = React.useState('');
   const [type, setType] = React.useState('');
   const [imageUrl, setImageUrl] = React.useState('');

   // todo TOKEN MOXIRIFADO */.................................................
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

   const submit = React.useCallback(async () => {
      if (cart.length > 0) {
         for (let i = 0; i < cart.length; i += 1) {
            const dados = cart[i];
            Fire()
               .collection(colect.solicitacao)
               .add(dados)
               .catch(err => {
                  return Alert.alert('Erro ao carregar ser dados', err);
               });
            for (let i = 0; i < tokenMoxerife.length; i += 1) {
               const message = {
                  to: tokenMoxerife[i].token,
                  sound: 'default',
                  title: 'NOVA REQUISIÇÃO DE EPI',
                  body: `Colaborador ${user.nome} fez uma socilicitação do item: ${dados.material_info.descricao}`,
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
         Alert.alert('Sucesso!', 'Aguarde a separaçao do seu pedido');
         nav.reset({
            index: 1,
            routes: [{ name: 'home' }],
         });
      } else {
         if (item === 'SELECIONE UM ITEM') {
            return Alert.alert('ALERTA', 'selecione um item para continuar');
         }

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
         if (image === null) {
            return Alert.alert(
               'ATENÇÃO',
               'Favor adicionar uma imagem mostrando a situação do item à ser trocado',
            );
         }

         const dados = {
            id: new Date().getTime(),
            whoFor: 'PESSOAL',
            data: format(new Date(), 'dd/MM/yy'),
            descricao,
            quantidade: qnt,
            situacao: 'pendente',
            image: imageUrl,
            user_info: user,
            material_info: materialInfo,
         };

         Fire()
            .collection(colect.solicitacao)
            .add(dados)
            .then(() => {
               Alert.alert('Sucesso!', 'Aguarde a separaçao do seu pedido');
               nav.reset({
                  index: 1,
                  routes: [{ name: 'home' }],
               });
            })
            .catch(err => {
               return Alert.alert(
                  'Ocorreu um erro ao carregar seus arquivos',
                  err,
               );
            });

         for (let i = 0; i < tokenMoxerife.length; i += 1) {
            const message = {
               to: tokenMoxerife[i].token,
               sound: 'default',
               title: 'NOVA REQUISIÇÃO DE EPI',
               body: `Colaborador ${user.nome} fez uma socilicitação do item: ${dados.material_info.descricao}`,
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
      colect.solicitacao,
      descricao,
      expoToken,
      image,
      imageUrl,
      item,
      materialInfo,
      nav,
      qnt,
      tokenMoxerife,
      user,
   ]);

   const handleSubmit = useCallback(() => {
      Fire()
         .collection(colecao.solicitacao)
         .get()
         .then(h => {
            const dt = h.docs.map(h => h.data() as IReqEpi);
            const fil = dt.find(h => {
               if (
                  h.situacao === 'pendente' &&
                  user.id === h.user_info.id &&
                  h.material_info.codigo === materialInfo.codigo
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

            submit();
            setCart([]);
         });
   }, [materialInfo, submit, user.id]);

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

      Fire()
         .collection(colecao.solicitacao)
         .get()
         .then(h => {
            const dt = h.docs.map(h => h.data() as IReqEpi);
            const fil = dt.find(h => {
               if (
                  h.situacao === 'pendente' &&
                  user.id === h.user_info.id &&
                  h.material_info.codigo === materialInfo.codigo
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
               id: new Date().getTime(),
               data: format(new Date().getTime(), 'dd/mm/yy'),
               description: descricao,
               quantidade: qnt,
               situacao: 'pendente',
               image: imageUrl,
               user_info: user,
               material_info: materialInfo,
               whoFor: 'PESSOAL',
            };

            const findD = cart.find(h => {
               if (h.material_info.descricao === materialInfo.descricao) {
                  return h;
               }
            });

            if (findD) {
               return Alert.alert(
                  'Atenção',
                  'você já adicionou esse item na lista!',
               );
            }

            setType('');
            setItem('SELECIONE UM ITEM');
            setDescricao('');
            setQnt('');
            setImage(null);
            setCart([...cart, dados]);
         });
   }, [
      cart,
      descricao,
      expoToken,
      image,
      imageUrl,
      item,
      materialInfo,
      qnt,
      user,
   ]);

   const handleSelectItem = React.useCallback((item: IMaterial) => {
      setItem(
         item.descricao === 'NENHUM' ? 'SELECIONE UM ITEM' : item.descricao,
      );
      setMaterialInfo(item);

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
         const reference = storage().ref(`/epi/${fileName}.png`);

         await reference.putFile(result.uri);
         const photoUrl = await reference.getDownloadURL();
         setImageUrl(photoUrl);
      }
   }, []);

   const [search, setSearch] = React.useState('');

   const filtroMateriais = React.useMemo(() => {
      return dataMaterial.filter(h => h.ft === 'EPI');
   }, [dataMaterial]);

   const materiaisEpis =
      search.length > 0
         ? filtroMateriais.filter(h => {
              return h.descricao.includes(search);
           })
         : filtroMateriais;

   return (
      <Box>
         <Modal visible={showModaItens}>
            <Box p="3" flex={1} bg="dark.800">
               <Box mb="5">
                  <SearchInput
                     text="PESQUISAR UM ITEM"
                     onChangeText={h => setSearch(h)}
                     autoCapitalize="characters"
                  />
               </Box>

               <FlatList
                  data={materiaisEpis}
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
         <Header text="REQUISIÇÃO DE EPIS" />

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
                  <Center
                     p="2"
                     mt="5"
                     borderRadius="10"
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
                        <GlobalText
                           text="Adicionar foto"
                           font="Black"
                           size={14}
                           color={theme.colors.blue.tom}
                        />
                     )}
                  </Center>
               </TouchableOpacity>
            </VStack>
         </Box>

         <HStack mt="5" justifyContent="space-between" px={5}>
            <Center>
               <Button
                  bg={theme.colors.green.tom}
                  fontFamily="Bold"
                  onPress={handleSubmit}
               >
                  FINALIZAR PEDIDO
               </Button>
            </Center>

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
   );
}
