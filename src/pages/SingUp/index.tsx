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
import { ModalCity } from '../../components/ModalCity';

export function SignUp() {
   const { navigate } = useNavigation();

   const [email, setEmail] = React.useState('');
   const [senha, setSenha] = React.useState('');
   const [matricula, setMatricula] = React.useState('');
   const [nome, setNome] = React.useState('');
   const [city, setCity] = React.useState('ESCOLHA SUA CIDADE');

   const [modalCity, setModalCity] = React.useState(false);

   const [erro, setErro] = React.useState(false);

   console.log(city);

   const handleSubmit = React.useCallback(async () => {
      setErro(false);
      if (email === '' && senha === '' && matricula === '' && nome === '') {
         return setErro(!erro);
      }

      if (city === 'ESCOLHA SUA CIDADE') {
         return Alert.alert('ESCOLHA SUA CIDADE');
      }

      if (senha.length < 6) {
         return Alert.alert('Senha deve conter mínimo de 6 digitos');
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
                  city,
               })
               .then(() => {
                  Alert.alert('Cadastro realizado');
                  navigate('signIn');
               })
               .catch(h => {
                  console.log(h);
               });
         })
         .catch(h => {
            if (h.code === 'auth/invalid-email') {
               Alert.alert('Erro ao criar sua conta', 'Insira um email valido');
            }
            console.log(h.code);
         });
   }, [city, email, erro, matricula, navigate, nome, senha]);

   const w = Dimensions.get('window').width;

   const handleSelect = React.useCallback(() => {
      setModalCity(false);
   }, []);

   return (
      <>
         <Box bg={theme.colors.blue.tom} flex="1">
            <ModalCity
               visible={modalCity}
               pres={handleSelect}
               selectCity={(item: string) => setCity(item)}
               select={city}
            />
            <Center mt={-w * 0.1}>
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
                  marginTop: -w * 1.1,
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
                           text="CRIE SUA CONTA"
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

                           <TouchableOpacity onPress={() => setModalCity(true)}>
                              <Center py="2" bg="dark.900" mt="10">
                                 <GlobalText
                                    text={city}
                                    font={theme.fonts.black}
                                    color={theme.colors.blue.tom}
                                 />
                              </Center>
                           </TouchableOpacity>
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
      </>
   );
}
