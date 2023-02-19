import { IRol } from "./Rol";

export interface IUsuario {
  _id?: string;
  name: string;
  lastname: string;
  tipDocument: string;
  nroDocument: string;
  role: IRol | string;
  email: string;
  owner?: IUsuario | string;
  fullname?: string;
  password?: string;
  roleId?: string;
  resource?: any[];
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  liga: string;
}
