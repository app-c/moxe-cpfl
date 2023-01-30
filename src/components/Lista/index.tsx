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
}

export function Lista({ del, item }: IProps) {
   const [color, setColor] = React.useState('red.500');
   const w = Dimensions.get('window').width;

   const { colors } = theme;

   React.useEffect(() => {
      if (item.situacao === 'pendente') {
         setColor(colors.red.tom);
      }

      if (item.situacao === 'separado') {
         setColor(colors.yellow.tom);
      }

      if (item.situacao === 'entregue') {
         setColor(colors.green.tom);
      }
   }, [colors.green.tom, colors.red.tom, colors.yellow.tom, item]);

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
               <GlobalText
                  font="Black"
                  text={`ITEM: ${item.material_info.descricao}`}
               />
            </Box>
            <GlobalText font="Black" text={`QUANTIDADE: ${item.quantidade}`} />
            <GlobalText font="Black" text={`DATA: ${item.data}`} />
            <GlobalText font="Black" text={`SITUAÇÃO: ${item.situacao}`} />
         </VStack>

         {item.situacao === 'pendente' && (
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
