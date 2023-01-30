/* eslint-disable camelcase */

interface PropsHome {
   nome: string;
   city: string;
   matricula: string;
}

export declare global {
   namespace ReactNavigation {
      interface RootParamList {
         signIn: undefined;
         signUp: undefined;
         home: PropsHome;
      }
   }
}
