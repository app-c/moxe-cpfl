import React from 'react';
import { Box, Button, FlatList, Text } from 'native-base';
import { Modal, TouchableOpacity } from 'react-native';
import theme from '../../global/styles/theme';
import { GlobalText } from '../GlobalText';

interface Props {
   select: string;
   pres: () => void;
   visible: boolean;
   selectCity: (city: string) => void;
}

const city = [
   { city: 'BOTUCATU', id: 1 },
   { city: 'RIBEIRÃO PRETO', id: 2 },
];

export function ModalCity({ visible, select, pres, selectCity }: Props) {
   return (
      <Modal visible={visible}>
         <Box flex="1" bg={theme.colors.blue.transparente} p="10">
            <FlatList
               data={city}
               renderItem={({ item: h }) => (
                  <TouchableOpacity onPress={() => selectCity(h.city)}>
                     <Box mt="5">
                        <GlobalText
                           text={h.city}
                           font={
                              select === h.city
                                 ? theme.fonts.black
                                 : theme.fonts.regular
                           }
                           color={
                              select === h.city
                                 ? theme.colors.blue.tom
                                 : theme.colors.blue.transparente2
                           }
                           size={18}
                        />
                        <Box
                           mt="1"
                           w="100%"
                           h="1"
                           bg={
                              select === h.city
                                 ? theme.colors.blue.tom
                                 : theme.colors.blue.transparente2
                           }
                        />
                     </Box>
                  </TouchableOpacity>
               )}
            />
         </Box>
         <Button _text={{ fontSize: 21 }} onPress={pres}>
            SELECIONAR
         </Button>
      </Modal>
   );
}
