/* eslint-disable react/require-default-props */
import { Box, Button, VStack } from 'native-base';
import React from 'react';
import { Dimensions } from 'react-native';
import { IReqEpi } from '../../dtos';
import theme from '../../global/styles/theme';
import { GlobalText } from '../GlobalText';
import { Line } from '../Line';

interface IProps {
   item: IReqEpi;
   del: () => void;
   showButton?: 'show' | 'none';
   situation: 'pendente' | 'separado' | 'entregue';
}

export function Lista({ del, item, showButton = 'none', situation }: IProps) {
   const [color, setColor] = React.useState('red.500');
   const w = Dimensions.get('window').width;

   const { colors } = theme;

   React.useEffect(() => {
      if (situation === 'pendente') {
         setColor(colors.red.tom);
      }

      if (situation === 'separado') {
         setColor(colors.yellow.tom);
      }

      if (situation === 'entregue') {
         setColor(colors.green.tom);
      }
   }, [colors.green.tom, colors.red.tom, colors.yellow.tom, item, situation]);

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
            <Box flexDirection="row" justifyContent="space-between">
               <GlobalText font="Black" text={`ITEM: ${item.item.descricao}`} />
            </Box>
            <GlobalText font="Black" text={`QUANTIDADE: ${item.qnt}`} />
            <GlobalText font="Black" text={`DATA: ${item.data}`} />
         </VStack>

         {showButton === 'show' && (
            <Button
               h={w * 0.08}
               p={0}
               w={w * 0.2}
               _text={{ fontSize: 14, fontWeight: 600 }}
               bg={theme.colors.red.tom}
               onPress={del}
            >
               Deletar
            </Button>
         )}
         <Line color={color} />
      </Box>
   );
}
