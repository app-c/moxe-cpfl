import React from 'react';
import { Text, Box, VStack } from 'native-base';
import theme from '../../global/styles/theme';
import { Line } from '../Line';

interface IProps {
   situacao: 'pendente' | 'em separacao' | 'entregue';
   item: string;
   data: string;
}

export function Lista({ situacao, item, data }: IProps) {
   const [color, setColor] = React.useState('red.500');

   const { colors } = theme;

   React.useEffect(() => {
      if (situacao === 'pendente') {
         setColor(colors.red.tom);
      }

      if (situacao === 'em separacao') {
         setColor(colors.yellow.tom);
      }

      if (situacao === 'entregue') {
         setColor(colors.green.tom);
      }
   }, [situacao]);

   return (
      <Box
         borderWidth={1}
         borderColor="dark.100"
         borderRadius={5}
         p="5"
         w="100%"
         mt="4"
         bg="dark.700"
      >
         <VStack space="2">
            <Text color="dark.200">ITEM: {item}</Text>
            <Text color="dark.200">DATA: {data}</Text>
            <Text color="dark.200">SITUAÇÃO: {situacao}</Text>
         </VStack>
         <Line color={color} />
      </Box>
   );
}
