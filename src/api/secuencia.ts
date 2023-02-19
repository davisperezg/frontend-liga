import axios from "axios";
import { BASE_API } from "../utils/const";

//para ticketear
export const getSecuencia = async (id: string) => {
  const { data } = await axios.get(`${BASE_API}/api/v1/secuencias/${id}`);
  return data;
};

export const getSecuencias = async () => {
  const { data } = await axios.get(`${BASE_API}/api/v1/secuencias`);
  return data;
};

export const createOrUpdateSecuencia = async (body: any, id?: string) => {
  if (id) {
    const { data } = await axios.put<any>(
      `${BASE_API}/api/v1/secuencias/${id}`,
      body
    );
    return data;
  } else {
    const { data } = await axios.post<any>(
      `${BASE_API}/api/v1/secuencias`,
      body
    );
    return data;
  }
};
