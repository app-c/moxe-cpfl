import React from 'react';
import { Text, Box, HStack } from 'native-base';
import { Dimensions } from 'react-native';
import { GlobalText } from '../GlobalText';

const w = Dimensions.get('window').width;

interface Props {
   item: string;
   qnt: string;
   description: string;
}

export function CardItem({ item, qnt, description }: Props) {
   return (
      <Box borderRadius="10" p="5" w="90%" bg="dark.600">
         <HStack p="1" bg="dark.700" alignItems="center">
            <GlobalText font="Black" text="Item: " />
            <GlobalText text={item} font="Regular" size={12} />
         </HStack>

         <HStack alignItems="center" p="1">
            <GlobalText font="Black" text="Quantidade: " />
            <GlobalText text={qnt} font="Regular" size={12} />
         </HStack>

         <HStack p="1" bg="dark.700" alignItems="center">
            <GlobalText font="Black" text="Descrição: " />
            <GlobalText text={description} font="Regular" size={12} />
         </HStack>
      </Box>
   );
}
