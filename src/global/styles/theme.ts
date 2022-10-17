import { extendTheme } from 'native-base';

export default {
   colors: {
      red: {
         tom: 'rgba(167, 27, 27, 1)',
         tranparente: 'rgba(167, 27, 27, 0.2)',
      },
      yellow: {
         tom: 'rgba(212, 183, 27, 1)',
         tranparente: 'rgba(212, 183, 27, 0.4)',
      },
      green: {
         tom: 'rgba(79, 149, 77, 1)',
         tranparente: 'rgba(79, 149, 77, 0.7)',
      },
      blue: {
         tom: 'rgba(28, 57, 90, 1)',
         transparente: 'rgba(28, 57, 90, 0.4)',
         transparente2: 'rgba(28, 57, 90, 0.6)',
      },

      orange: {
         tom: 'rgba(243, 142, 0, 1)',
         transparente: 'rgba(243, 142, 0, 0.5)',
      },
   },

   fonts: {
      bold: 'Bold',
      regular: 'Regular',
      black: 'Black',
   },
};

export const theme2 = extendTheme({
   fontConfig: {
      gloria: 'gloria',
      catarina: {
         normal: 'regular',
         bold: 'Bold',
         black: 'Black',
      },
   },
   fonts: {
      heading: 'catarina',
      body: 'Bold',
      mono: 'Black',
   },
});
