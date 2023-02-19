import { IUsuario } from "./Usuario";

export interface IPrecio {
  liga: string;
  usuario: string;
  costo: number;
  _id?: string;
  updatedBy?: IUsuario | String;
  createdBy?: IUsuario | String;
  createdAt?: Date;
  updatedAt?: Date;
}
