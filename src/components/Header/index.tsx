import { FontAwesome5 } from '@expo/vector-icons';
import { Box, Center, HStack, Image } from 'native-base';
import React from 'react';
import { Dimensions, Text, TouchableOpacity } from 'react-native';
import logo from '../../assets/ico.png';
import theme from '../../global/styles/theme';
import { useAuth } from '../../hooks/AuthContext';

interface Props {
   text: string;
}

export function Header({ text }: Props) {
   const { signOut } = useAuth();
   const wi = Dimensions.get('window').width;
   return (
      <Box py={wi * 0.05} pb="3" bg={theme.colors.blue.tom}>
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
               w={wi * 0.25}
               h={wi * 0.15}
               resizeMode="contain"
               top="3"
               source={logo}
            />
            <Box w={wi * 0.5} top="2">
               <Text
                  style={{
                     color: '#fff',
                     fontFamily: 'bold',
                  }}
               >
                  Olá
               </Text>
               <Text
                  style={{
                     color: '#fff',
                     fontFamily: 'bold',
                     fontSize: 14,
                  }}
               >
                  {text}
               </Text>
            </Box>

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
