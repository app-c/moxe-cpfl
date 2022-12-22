/* eslint-disable react/jsx-props-no-spreading */
import {
   Box,
   FormControl,
   IInputProps,
   Input as In,
   WarningOutlineIcon
} from 'native-base';
import React from 'react';

interface Props extends IInputProps {
   title: string;
   erroMessage: string;
   error: boolean;
   label: string;
   text: string;
}

export function Input({
   title,
   erroMessage,
   error,
   label,
   text,
   ...rest
}: Props) {
   return (
      <Box w="100%">
         <FormControl isInvalid={error}>
            <In
               fontFamily="bold"
               mt="2"
               fontSize={14}
               variant="underlined"
               placeholder={title}
               placeholderTextColor="#201919"
               {...rest}
            />
            <FormControl.ErrorMessage
               leftIcon={<WarningOutlineIcon size="xs" />}
            >
               {erroMessage}#555555
            </FormControl.ErrorMessage>
         </FormControl>
      </Box>
   );
}
