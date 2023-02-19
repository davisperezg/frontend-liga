import { BASE_API } from "../utils/const";
import axios from "axios";

export const createTicket = async (body: any) => {
  const { data } = await axios.post<any>(`${BASE_API}/api/v1/tickets`, body);
  return data;
};

export const getTicket = async (id: string) => {
  const { data } = await axios.get<any>(`${BASE_API}/api/v1/tickets/${id}`);
  return data;
};

export const getChecking = async (id: string) => {
  const { data } = await axios.get<any>(
    `${BASE_API}/api/v1/tickets/checking/${id}`
  );
  return data;
};

export const allTickets = async () => {
  const { data } = await axios.get<any>(`${BASE_API}/api/v1/tickets`);
  return data;
};
