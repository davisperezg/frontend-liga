import axios from "axios";
import { IPrecio } from "../interfaces/Precio";
import { BASE_API } from "../utils/const";

export const getPrecios = async () => {
  const { data } = await axios.get(`${BASE_API}/api/v1/precios`);
  return data;
};

export const createOrUpdatePrecio = async (body: any, id?: string) => {
  if (id) {
    const { data } = await axios.put<any>(
      `${BASE_API}/api/v1/precios/${id}`,
      body
    );
    return data;
  } else {
    const { data } = await axios.post<any>(`${BASE_API}/api/v1/precios`, body);
    return data;
  }
};
