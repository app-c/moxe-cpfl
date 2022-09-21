import React from 'react';
import {
   Text,
   Box,
   Center,
   Image,
   Stack,
   FormControl,
   VStack,
   Button,
} from 'native-base';
import { Alert, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Fire from '@react-native-firebase/firestore';
import Auth from '@react-native-firebase/auth';
import { Input } from '../../components/Input';
import { colecao } from '../../colecao';
import log from '../../../assets/ranha.png';
import { GlobalText } from '../../components/GlobalText';
import theme from '../../global/styles/theme';

export function SignUp() {
   const { navigate } = useNavigation();

   const [email, setEmail] = React.useState('');
   const [senha, setSenha] = React.useState('');
   const [matricula, setMatricula] = React.useState('');
   const [nome, setNome] = React.useState('');

   const [erro, setErro] = React.useState(false);

   const handleSubmit = React.useCallback(async () => {
      if (email === '' && senha === '' && matricula === '' && nome === '') {
         setErro(!erro);
      }

      Auth()
         .createUserWithEmailAndPassword(email, senha)
         .then(auth => {
            Fire()
               .collection(colecao.USER)
               .doc(auth.user.uid)
               .set({
                  id: auth.user.uid,
                  nome,
                  email,
                  senha,
                  matricula,
               })
               .then(() => {
                  Alert.alert('Cadastro realizado');
                  navigate('signIn');
               })
               .catch(h => Alert.alert('Algo deu errado', h));
         })
         .catch(h => Alert.alert('Algo deu errado', h));
   }, [email, erro, matricula, navigate, nome, senha]);
   const w = Dimensions.get('window').width;

   return (
      <Box bg={theme.colors.blue.tom} flex="1">
         <Center mt={-w * 0.2}>
            <Image source={log} size={w * 0.8} alt="image" />
            <GlobalText
               text="SEEF"
               size={58}
               color={theme.colors.orange.tom}
               font="gloria"
               top={-120}
            />
         </Center>
         <ScrollView
            style={{
               marginTop: -w * 1,
               height: w * 2,
            }}
            contentContainerStyle={{
               height: w * 2.1,
               marginTop: w * 0.8,
            }}
         >
            <Box mt={0}>
               <Center>
                  <Box p="10" w="100%">
                     <GlobalText
                        font="Black"
                        size={18}
                        color="#fff"
                        text="CRIE SUA CONTA MOXE"
                        alignSelf="center"
                     />
                     <VStack space={2}>
                        <Input
                           autoCapitalize="none"
                           keyboardType="email-address"
                           label="E-mail"
                           error={erro}
                           title="digite seu email"
                           erroMessage="Digite seu email seu email"
                           onChangeText={h => setEmail(h)}
                           value={email}
                           color="dark.900"
                           fontSize={16}
                           pl={5}
                           selectionColor={theme.colors.orange.tom}
                        />
                        <Input
                           keyboardType="numeric"
                           label="Matrícula"
                           title="digite sua matricula"
                           error={erro}
                           erroMessage="digite sua matrícula"
                           onChangeText={h => setMatricula(h)}
                           color="dark.900"
                           fontSize={16}
                           pl={5}
                           selectionColor={theme.colors.orange.tom}
                        />
                        <Input
                           label="Nome"
                           title="digite seu nome"
                           error={erro}
                           erroMessage="digite seu nome"
                           onChangeText={h => setNome(h)}
                           color="dark.900"
                           fontSize={16}
                           pl={5}
                           selectionColor={theme.colors.orange.tom}
                        />
                        <Input
                           label="Senha"
                           title="digite sua senha"
                           error={erro}
                           erroMessage="digite sua senha"
                           onChangeText={h => setSenha(h)}
                           color="dark.900"
                           fontSize={16}
                           pl={5}
                           selectionColor={theme.colors.orange.tom}
                        />
                     </VStack>
                  </Box>

                  <Button
                     justifyContent="center"
                     alignItems="center"
                     onPress={handleSubmit}
                     w={w * 0.5}
                     size="lg"
                  >
                     CRIAR
                  </Button>
               </Center>

               <Box mt={10} p="5">
                  <TouchableOpacity onPress={() => navigate('signIn')}>
                     <GlobalText
                        color={theme.colors.orange.tom}
                        text="VOLTAR"
                        size={20}
                        font="Black"
                     />
                  </TouchableOpacity>
               </Box>
            </Box>
         </ScrollView>
      </Box>
   );
}
