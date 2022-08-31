import React from 'react';
import { Text, Box, Center, VStack, Button } from 'native-base';
import Fire from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Input } from '../../components/Input';
import { useAuth } from '../../hooks/AuthContext';
import { colecao } from '../../colecao';
import { IUser } from '../../dtos';

export function CreateFerramenta() {
   const { user } = useAuth();
   const colect = colecao;
   const nav = useNavigation();

   const [item, setItem] = React.useState('');
   const [descricao, setDescricao] = React.useState('');
   const [tokenMoxerife, setTokenMoxerife] = React.useState(null);

   React.useEffect(() => {
      Fire()
         .collection(colecao.MOXERIFE)
         .get()
         .then(mox => {
            const moxe = mox.docs.map(h => h.data() as IUser);
            setTokenMoxerife(moxe[0].token);
         });
   }, []);

   const handleSubmit = React.useCallback(async () => {
      const dados = {
         item,
         data: new Date().getTime(),
         situacao: 'entregue',
         descricao,
         user_id: user.id,
         nome: user.nome,
         token: user.token,
      };

      Fire()
         .collection(colect.REQFERRAMENTA)
         .add(dados)
         .then(() => {
            Alert.alert('Sucesso!', 'Aguarde a separaçao do seu pedido');
            nav.navigate('home');
            setDescricao('');
            setItem('');
         });

      const message = {
         to: tokenMoxerife,
         sound: 'default',
         title: 'NOVA REQUISIÇÃO DE EPI',
         body: `Colaborador ${user.nome} está adiquirindo: ${dados.item}`,
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
   }, [
      colect.REQFERRAMENTA,
      descricao,
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
                  error
                  erroMessage="item obrigátorio"
                  onChangeText={h => setItem(h)}
               />
               <Input
                  onChangeText={h => setDescricao(h)}
                  label="DESCRIÇAO"
                  title="Descreva o motivo do pedido"
               />
            </VStack>
         </Box>

         <Center>
            <Button onPress={handleSubmit}>Finalizar pedido</Button>
         </Center>
      </Box>
   );
}
