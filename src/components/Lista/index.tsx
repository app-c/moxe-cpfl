import React from 'react';
import { Text, Box, VStack } from 'native-base';
import theme from '../../global/styles/theme';
import { Line } from '../Line';
import { GlobalText } from '../GlobalText';

interface IProps {
   situacao: string;
   item: string;
   data: string;
   qnt: string;
}

export function Lista({ situacao, item, data, qnt }: IProps) {
   const [color, setColor] = React.useState('red.500');

   const { colors } = theme;

   React.useEffect(() => {
      if (situacao === 'pendente') {
         setColor(colors.red.tom);
      }

      if (situacao === 'separado') {
         setColor(colors.yellow.tom);
      }

      if (situacao === 'entregue') {
         setColor(colors.green.tom);
      }
   }, [colors.green.tom, colors.red.tom, colors.yellow.tom, situacao]);

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
            <GlobalText font="Black" text={`ITEM: ${item}`} />
            <GlobalText font="Black" text={`QUANTIDADE: ${qnt}`} />
            <GlobalText font="Black" text={`DATA: ${data}`} />
            <GlobalText font="Black" text={`SITUAÇÃO: ${situacao}`} />
         </VStack>
         <Line color={color} />
      </Box>
   );
}
