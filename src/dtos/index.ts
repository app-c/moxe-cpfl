/* eslint-disable camelcase */
export interface IUser {
   nome: string;
   email: string;
   matricula: number;
   id: string;
   token: string;
}

export interface IReqEpi {
   item: string;
   data: number;
   situacao: 'pendente' | 'em separacao' | 'entregue';
   descricao: string;
   id: string;
   user_id: string;
   nome: string;
   dataFormatada?: string;
}

export interface IReqFerramenta {
   item: string;
   data: number;
   situacao: string;
   descricao: string;
   id: string;
   user_id: string;
   nome: string;
   dataFormatada?: string;
}
