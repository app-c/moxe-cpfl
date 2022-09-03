import React from 'react';
import { Text, Box } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { Line } from '../Line';

interface Props {
   item: string;
   pres: () => void;
}

export function Itens({ item, pres }: Props) {
   return (
      <Box mt="1">
         <TouchableOpacity onPress={pres}>
            <Box p="3" bg="dark.700">
               <Text fontSize={16} color="dark.100">
                  {item}
               </Text>
            </Box>
         </TouchableOpacity>
      </Box>
   );
}
