import React from 'react';
import { Text, Box, Center } from 'native-base';
import { Dimensions, TouchableOpacity } from 'react-native';
import { GlobalText } from '../GlobalText';
import theme from '../../global/styles/theme';

interface Props {
   title: string;
   pres: () => void;
   presIn: boolean;
}

export function Cards({ title, pres, presIn }: Props) {
   const w = Dimensions.get('window').width;
   return (
      <TouchableOpacity onPress={pres}>
         <Box
            alignItems="center"
            justifyContent="center"
            // size="40"
            borderRadius="10"
            bg={theme.colors.green.tom}
            opacity={presIn ? 1 : 0.4}
            ml="10"
            h={w * 0.1}
            px="10"
         >
            <Center>
               <GlobalText text={title} size={20} font="Regular" color="#fff" />
            </Center>
         </Box>
      </TouchableOpacity>
   );
}
