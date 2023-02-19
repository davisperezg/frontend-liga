import { IModulo } from "./Modulo";

export interface IRol {
  _id?: string;
  name: string;
  description?: string;
  module: IModulo[] | string[];
  status?: boolean;
  creator?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
