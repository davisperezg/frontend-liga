import { IUsuario } from "./Usuario";

export interface ISecuencia {
  _id?: string;
  liga: string;
  secuencia: number;
  createdBy?: IUsuario | String;
  updatedBy?: IUsuario | String;
  createdAt?: Date;
  updatedAt?: Date;
}
