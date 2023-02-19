import { IPrecio } from "./Precio";
// import { IPrecio } from "./Precio";

export interface ITicket {
  nroTicket: number;
  details: IDetailTicket[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDetailTicket {
  nroTicket: number;
  nroItem: number;
  usuario: IPrecio;
  cantidad: number;
  price: number;
}
