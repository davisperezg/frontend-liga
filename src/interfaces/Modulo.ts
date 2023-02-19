import { IMenu } from "./Menu";

export interface IModulo {
  _id?: string;
  name: string;
  status?: boolean;
  link?: string;
  menu: IMenu[] | string[];
  createdAt?: Date;
  updatedAt?: Date;
}
