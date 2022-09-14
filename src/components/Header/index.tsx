import React from 'react';
import { Box, Center, HStack, Image } from 'native-base';
import { Dimensions, Text, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import theme from '../../global/styles/theme';
import logo from '../../assets/ico.png';
import { useAuth } from '../../hooks/AuthContext';

interface Props {
   text: string;
}

export function Header({ text }: Props) {
   const { signOut } = useAuth();
   const wi = Dimensions.get('window').width;
   return (
      <Box py={wi * 0.015} pb="3" bg={theme.colors.blue.tom}>
         <Center />
         <HStack
            mt="5"
            justifyContent="space-between"
            alignItems="center"
            px="4"
         >
            <Image
               alt="image"
               // size={wi * 0.3}
               w={wi * 0.33}
               h={wi * 0.2}
               resizeMode="contain"
               top="3"
               source={logo}
            />
            <Text
               style={{
                  color: '#fff',
                  fontFamily: 'bold',
                  fontSize: 18,
                  textAlign: 'center',
               }}
            >
               Olá {'\n'}
               {text}
            </Text>

            <TouchableOpacity onPress={signOut}>
               <Center>
                  <FontAwesome5
                     name="power-off"
                     size={25}
                     color={theme.colors.orange.tom}
                  />
                  <Text style={{ color: '#fff', fontFamily: 'bold' }}>
                     SAIR
                  </Text>
               </Center>
            </TouchableOpacity>
         </HStack>
      </Box>
   );
}
