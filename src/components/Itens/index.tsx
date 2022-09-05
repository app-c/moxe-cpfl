import React from 'react';
import { Text, Box } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Line } from '../Line';
import { GlobalText } from '../GlobalText';
import theme from '../../global/styles/theme';

interface Props {
   item: string;
   pres: () => void;
}

export function Itens({ item, pres }: Props) {
   return (
      <Box mt="1">
         <TouchableOpacity onPress={pres}>
            <Box p="3" bg="dark.700">
               <GlobalText
                  text={item}
                  size={14}
                  color={theme.colors.blue.tom}
                  font="Black"
               />
            </Box>
         </TouchableOpacity>
      </Box>
   );
}
