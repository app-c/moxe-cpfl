/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
   Text,
   Box,
   Stack,
   FormControl,
   Input as In,
   IInputProps,
   WarningOutlineIcon,
} from 'native-base';

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
            <In mt="2" variant="underlined" placeholder={title} {...rest} />
            <FormControl.ErrorMessage
               leftIcon={<WarningOutlineIcon size="xs" />}
            >
               {erroMessage}
            </FormControl.ErrorMessage>
         </FormControl>
      </Box>
   );
}
