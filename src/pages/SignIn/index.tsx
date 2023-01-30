import { useNavigation } from '@react-navigation/native';
import {
   Box,
   Button,
   Center,
   Image,
   KeyboardAvoidingView,
   Text,
   VStack
} from 'native-base';
import React from 'react';
import { ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import log from '../../../assets/ranha.png';
import { GlobalText } from '../../components/GlobalText';
import { Input } from '../../components/Input';
import theme from '../../global/styles/theme';
import { useAuth } from '../../hooks/AuthContext';

export function SignIn() {
   const w = Dimensions.get('window').width;
   const { navigate } = useNavigation();
   const { signIn } = useAuth();

   const [email, setEmail] = React.useState('');
   const [senha, setSenha] = React.useState('');
   const [erroMail, setErroMail] = React.useState(false);
   const [messageErr, setMessageErr] = React.useState('');

   const [loading, setLoading] = React.useState(false);

   const [errSenha, setErrSenha] = React.useState(false);
   const [messageErrSenha, setMessageErrSenha] = React.useState('');

   const handleSubmit = React.useCallback(() => {
      if (email === '') {
         setErroMail(true);
         setMessageErr('Digite um email');
         return;
      }

      if (senha === '') {
         setErrSenha(true);
         setMessageErrSenha('Digite uma senha');
         return;
      }

      if (senha.length < 6) {
         setErrSenha(true);
         setMessageErrSenha('Senha no mínimo 6 digitos');
         return;
      }
      setLoading(true);

      setErroMail(false);
      setErrSenha(false);

      signIn({
         email,
         senha,
      })
         .catch(err => {
            if (err.code === 'auth/user-not-found') {
               setErroMail(true);
               setMessageErr('Usuário não encontrado');
            }

            if (err.code === 'auth/invalid-email') {
               setErroMail(true);
               setMessageErr('Email invalido');
            }

            if (err.code === 'auth/wrong-password') {
               setErrSenha(true);
               setMessageErrSenha('Senha inválida');
            }

            setLoading(false);
         })
         .finally(() => {
            setLoading(false);
         });
   }, [email, senha, signIn]);

   return (
      <>
         <Box bg={theme.colors.blue.tom} flex="1">
            <Text color="#fff" left={10} top="10">
               version: 1.0.2
            </Text>
            <KeyboardAvoidingView
               behavior="position"
               style={{ paddingBottom: 90 }}
            >
               <Center>
                  <Image source={log} size="300" alt="image" />
                  <GlobalText
                     text="SEEF"
                     size={58}
                     color={theme.colors.orange.tom}
                     font="gloria"
                     marginTop={-100}
                     top={-20}
                  />
               </Center>

               <Center>
                  <Box p="10" w="100%">
                     <GlobalText
                        text="Entre com sua conta"
                        color="#fff"
                        font="bold"
                        size={16}
                     />
                     <VStack space={2}>
                        <Input
                           keyboardType="email-address"
                           autoCapitalize="none"
                           error={erroMail}
                           title="digite seu email"
                           erroMessage={messageErr}
                           label="E-mail"
                           onChangeText={h => setEmail(h)}
                           color="dark.900"
                           fontSize={16}
                           pl={5}
                           selectionColor={theme.colors.orange.tom}
                           fontFamily="gloria"
                        />
                        <Input
                           secureTextEntry
                           onChangeText={h => setSenha(h)}
                           title="digite sua senha"
                           erroMessage={messageErrSenha}
                           error={errSenha}
                           fontSize={16}
                           pl={5}
                           selectionColor={theme.colors.orange.tom}
                           color="dark.900"
                        />
                     </VStack>
                  </Box>

                  <TouchableOpacity>
                     <Box>
                        {loading ? (
                           <ActivityIndicator />
                        ) : (
                           <Button onPress={handleSubmit} w="80%" size="lg">
                              Entrar
                           </Button>
                        )}
                     </Box>
                  </TouchableOpacity>
               </Center>
            </KeyboardAvoidingView>
         </Box>

         <Box bg={theme.colors.blue.transparente} flex="0.1">
            <Center mt={w * 0.04}>
               <TouchableOpacity onPress={() => navigate('signUp')}>
                  <GlobalText
                     color={theme.colors.blue.tom}
                     font="Black"
                     size={16}
                     text="CRIAR UM CONTA"
                  />
               </TouchableOpacity>
            </Center>
         </Box>
      </>
   );
}
