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
import { Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Fire from '@react-native-firebase/firestore';
import Auth from '@react-native-firebase/auth';
import { Input } from '../../components/Input';
import { colecao } from '../../colecao';

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
               });
         })
         .catch(h => console.log(h));
   }, [email, erro, matricula, navigate, nome, senha]);

   return (
      <Box flex="1">
         <ScrollView>
            <Box alignItems="center" justifyContent="center">
               <Center>
                  <Image w="40%" bg="red.900" alt="image" />
               </Center>
            </Box>

            <Center>
               <Text>SignIn</Text>
               <Box p="10" w="100%">
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
                     />
                     <Input
                        keyboardType="numeric"
                        label="Matrícula"
                        title="digite sua matricula"
                        error={erro}
                        erroMessage="digite sua matrícula"
                        onChangeText={h => setMatricula(h)}
                     />
                     <Input
                        label="Nome"
                        title="digite seu nome"
                        error={erro}
                        erroMessage="digite seu nome"
                        onChangeText={h => setNome(h)}
                     />
                     <Input
                        label="Senha"
                        title="digite sua senha"
                        error={erro}
                        erroMessage="digite sua senha"
                        onChangeText={h => setSenha(h)}
                     />
                  </VStack>
               </Box>

               <Button
                  justifyContent="center"
                  alignItems="center"
                  onPress={handleSubmit}
                  w="100%"
                  size="lg"
               >
                  CRIAR
               </Button>
            </Center>

            <Box mt={10} p="5">
               <TouchableOpacity onPress={() => navigate('signUp')}>
                  <Text>VOLTAR</Text>
               </TouchableOpacity>
            </Box>
         </ScrollView>
      </Box>
   );
}
