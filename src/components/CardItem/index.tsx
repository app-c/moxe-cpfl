import React from 'react';
import { Text, Box, HStack } from 'native-base';
import { Dimensions } from 'react-native';

const w = Dimensions.get('window').width;

interface Props {
   item: string;
   qnt: string;
   description: string;
}

export function CardItem({ item, qnt, description }: Props) {
   return (
      <Box borderRadius="10" p="5" w="90%" bg="dark.600">
         <HStack p="1" bg="dark.700">
            <Text>Item: </Text>
            <Text ml={w * 0.2}>{item}</Text>
         </HStack>

         <HStack p="1">
            <Text>Quantidae: </Text>
            <Text ml={w * 0.11}>{qnt}</Text>
         </HStack>

         <HStack p="1" bg="dark.700">
            <Text>Descrição: </Text>
            <Text ml={w * 0.11}>{description}</Text>
         </HStack>
      </Box>
   );
}
