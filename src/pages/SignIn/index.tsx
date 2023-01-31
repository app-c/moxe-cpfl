import { useNavigation } from '@react-navigation/native';
import {
   Box,
   Button,
   Center,
   Image,
   KeyboardAvoidingView,
   Text,
   VStack,
} from 'native-base';
import React from 'react';
import {
   ActivityIndicator,
   Alert,
   Dimensions,
   TouchableOpacity,
} from 'react-native';
import log from '../../../assets/ranha.png';
import { GlobalText } from '../../components/GlobalText';
import { Input } from '../../components/Input';
import { ModalCity } from '../../components/ModalCity';
import theme from '../../global/styles/theme';
import { useAuth } from '../../hooks/AuthContext';

export function SignIn() {
   const w = Dimensions.get('window').width;
   const { navigate } = useNavigation();
   const { signIn } = useAuth();

   const [nome, setNome] = React.useState('');
   const [matricula, setMatricula] = React.useState('');
   const [city, setCity] = React.useState('Selecione sua cidade');
   const [modalCity, setModalCity] = React.useState(false);

   const [loading, setLoading] = React.useState(false);

   const handleSubmit = React.useCallback(() => {
      if (nome === '' && matricula === '') {
         return Alert.alert('Erro', 'Favor informar seu nome e sua matrícula');
      }

      signIn({
         nome,
         matricula,
         city,
      });
   }, [city, matricula, nome, signIn]);

   const handleSelect = React.useCallback(() => {
      setModalCity(false);
   }, []);

   return (
      <Box bg={theme.colors.blue.tom} flex="1">
         <Text color="#fff" left={10} top="10">
            version: 2.0.0
         </Text>
         <KeyboardAvoidingView
            behavior="position"
            style={{ paddingBottom: 90 }}
         >
            <ModalCity
               visible={modalCity}
               pres={handleSelect}
               selectCity={(item: string) => setCity(item)}
               select={city}
            />
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

               <Box w="100%" p="10">
                  <Input
                     onChangeText={setNome}
                     _focus={{
                        borderColor: theme.colors.green.tom,
                     }}
                     selectionColor="#fff"
                     placeholder="Nome"
                     placeholderTextColor="rgb(200, 200, 200)"
                     color="#fff"
                     fontSize={18}
                  />

                  <Input
                     onChangeText={setMatricula}
                     _focus={{
                        borderColor: theme.colors.green.tom,
                     }}
                     selectionColor="#fff"
                     placeholder="Matrícula"
                     placeholderTextColor="rgb(200, 200, 200)"
                     color="#fff"
                     fontSize={18}
                  />

                  <TouchableOpacity onPress={() => setModalCity(true)}>
                     <Center w="100%" py="2" px="3" bg="dark.900" mt="10">
                        <GlobalText
                           text={city}
                           font={theme.fonts.black}
                           color={theme.colors.blue.tom}
                        />
                     </Center>
                  </TouchableOpacity>

                  <TouchableOpacity>
                     <Box mt="40%">
                        {loading ? (
                           <ActivityIndicator />
                        ) : (
                           <Button onPress={handleSubmit}>Entrar</Button>
                        )}
                     </Box>
                  </TouchableOpacity>
               </Box>
            </Center>
         </KeyboardAvoidingView>
      </Box>
   );
}
