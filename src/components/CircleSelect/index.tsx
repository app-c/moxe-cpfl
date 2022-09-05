import React from 'react';
import { Text, Box, Circle, Center, HStack } from 'native-base';
import { Dimensions, TouchableOpacity } from 'react-native';
import { GlobalText } from '../GlobalText';
import theme from '../../global/styles/theme';

const w = Dimensions.get('window').width;

interface Props {
   text: string;
   selected: boolean;
   pres: () => void;
}

export function CircleSelect({ text, selected, pres }: Props) {
   return (
      <TouchableOpacity onPress={pres}>
         <HStack mr="3" justifyContent="space-between">
            <Center
               borderRadius={w * 0.03}
               w={w * 0.06}
               h={w * 0.06}
               bg="dark.800"
               borderColor={theme.colors.blue.tom}
               borderWidth={3}
               mr="1"
            >
               <Box
                  bg={selected ? theme.colors.yellow.tom : 'dark.800'}
                  borderRadius={w * 0.015}
                  w={w * 0.03}
                  h={w * 0.03}
               />
            </Center>

            <Center mt="-1">
               <GlobalText text={text} font="bold" size={16} />
            </Center>
         </HStack>
      </TouchableOpacity>
   );
}
