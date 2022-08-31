/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
import React from 'react';
import { Text, Box, Center, VStack, Button } from 'native-base';
import Fire from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Input } from '../../components/Input';
import { useAuth } from '../../hooks/AuthContext';
import { colecao } from '../../colecao';
import { IUser } from '../../dtos';

interface Props {
   token: string;
}

export function CreateEpi() {
   const { user, expoToken } = useAuth();
   const colect = colecao;
   const nav = useNavigation();

   const [item, setItem] = React.useState('');
   const [descricao, setDescricao] = React.useState('');
   const [tokenMoxerife, setTokenMoxerife] = React.useState<Props[]>([]);
   const [erro, setErro] = React.useState(false);
   const [messageErrItem, setMessageErrItem] = React.useState('');
   const [errDes, setErrDes] = React.useState(false);
   const [messageErrDes, setMessageErrDes] = React.useState('');

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
      if (item.trim() === '' && item.trim() === '') {
         setErro(true);
         setErrDes(true);
         setMessageErrDes('descreva uma breve descrição do seu pedido');
         setMessageErrItem('item obrigatório');
         return;
      }

      const dados = {
         item,
         data: new Date().getTime(),
         situacao: 'pendente',
         descricao,
         user_id: user.id,
         nome: user.nome,
         token: expoToken,
      };

      Fire()
         .collection(colect.REQEPI)
         .add(dados)
         .then(() => {
            Alert.alert('Sucesso!', 'Aguarde a separaçao do seu pedido');
            nav.navigate('home');
         });

      for (let i = 0; i < tokenMoxerife.length; i += 1) {
         const message = {
            to: tokenMoxerife[i],
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

      setItem('');
      setDescricao('');
   }, [
      colect.REQEPI,
      descricao,
      expoToken,
      item,
      nav,
      tokenMoxerife,
      user.id,
      user.nome,
   ]);

   return (
      <Box>
         <Center mt="10">
            <Text>REQUISIÇÃO DE EPIS</Text>
         </Center>

         <Box p="10">
            <VStack>
               <Input
                  autoCapitalize="characters"
                  label="ITEM"
                  title="nome do epi"
                  text="erro"
                  error={erro}
                  erroMessage="Item obrigatório"
                  onChangeText={setItem}
                  value={item}
               />
               <Input
                  value={descricao}
                  error={errDes}
                  erroMessage={messageErrDes}
                  onChangeText={h => setDescricao(h)}
                  label="DESCRIÇAO"
                  title="Descreva o motivo do pedido"
                  text="descricao não pode ficar em branco"
               />
            </VStack>
         </Box>

         <Center>
            <Button onPress={handleSubmit}>Finalizar pedido</Button>
         </Center>
      </Box>
   );
}
