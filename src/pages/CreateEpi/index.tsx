/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
import { Feather } from '@expo/vector-icons';
import Fire from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import * as ImagePicker from 'expo-image-picker';
import { Box, Button, Center, HStack, Image, Text, VStack } from 'native-base';
import React from 'react';
import {
   ActivityIndicator,
   Alert,
   FlatList,
   Modal,
   TouchableOpacity,
} from 'react-native';
import { colecao } from '../../colecao';
import { CardItem } from '../../components/CardItem';
import { GlobalText } from '../../components/GlobalText';
import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Itens } from '../../components/Itens';
import { SearchInput } from '../../components/SearchInput';
import { IMaterial, IReqEpi, IUser } from '../../dtos';
import theme from '../../global/styles/theme';
import { useAuth } from '../../hooks/AuthContext';
import { materias } from '../../utils/MaterialList';

interface Props {
   token: string;
}

export function CreateEpi() {
   const { user, expoToken } = useAuth();
   const colect = colecao;
   const nav = useNavigation();

   const [loading, setLoading] = React.useState(false);

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

   const handleAddCart = React.useCallback(() => {
      const car: any[] = [];

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

      if (Number(qnt) > 5) {
         return Alert.alert(
            'Erro',
            'quantidade de pedido dever ser memor que 5 (cinco)',
         );
      }

      setLoading(true);

      Fire()
         .collection('pendente')
         .get()
         .then(h => {
            const dt = h.docs.map(h => h.data() as IReqEpi);
            const fil = dt.find(h => {
               if (
                  user.matricula === h.user.matricula &&
                  h.item.codigo === materialInfo.codigo
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
               data: format(new Date(), 'dd/MM/yy - HH:mm'),
               description: descricao,
               qnt: String(qnt),
               photo: imageUrl,
               user,
               item: materialInfo,
               pushNotification: expoToken,
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
         })
         .finally(() => setLoading(false));
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

   const handleSend = React.useCallback(() => {
      if (cart.length === 0) {
         return Alert.alert('Erro', 'Não há item em sua lista');
      }

      setLoading(true);

      setTimeout(() => {
         cart.forEach(i => {
            Fire().collection('pendente').add(i);
         });
         setCart([]);

         setLoading(false);

         nav.navigate('home');
      }, 3000);
   }, [cart, nav]);

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
                  <Button
                     bg={theme.colors.green.tom}
                     fontFamily="Bold"
                     onPress={handleSend}
                  >
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
                     qnt={h.qnt}
                     description={h.description}
                     item={h.item.descricao}
                  />
               </Box>
            )}
         />
      </Box>
   );
}
