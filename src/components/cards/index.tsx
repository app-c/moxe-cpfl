import React from 'react';
import { Text, Box, Center } from 'native-base';
import { TouchableOpacity } from 'react-native';

interface Props {
   title: string;
   pres: () => void;
   presIn: boolean;
}

export function Cards({ title, pres, presIn }: Props) {
   return (
      <Box
         alignItems="center"
         justifyContent="center"
         size="40"
         borderRadius="10"
         bg={presIn ? 'blue.800' : 'blue.500'}
         ml="10"
         h="20"
      >
         <TouchableOpacity onPress={pres}>
            <Center>
               <Text textAlign="center" fontSize="20" color="dark.900">
                  {title}
               </Text>
            </Center>
         </TouchableOpacity>
      </Box>
   );
}
