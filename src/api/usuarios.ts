import { BASE_API } from "../utils/const";
import axios from "axios";
import { IUsuario } from "../interfaces/Usuario";

export const getUsers = async () => {
  const { data } = await axios.get<IUsuario[]>(`${BASE_API}/api/v1/users`);
  return data;
};

export const restoreUser = async (id: string) => {
  const { data } = await axios.put<boolean>(
    `${BASE_API}/api/v1/users/restore/${id}`
  );

  return data;
};

export const deleteUser = async (id: string) => {
  const { data } = await axios.delete<boolean>(
    `${BASE_API}/api/v1/users/${id}`
  );

  return data;
};

export const createOrUpdateUser = async (body: any, id?: string) => {
  if (id) {
    const { data } = await axios.put<any>(
      `${BASE_API}/api/v1/users/${id}`,
      body
    );
    return data;
  } else {
    const { data } = await axios.post<any>(`${BASE_API}/api/v1/users`, body);
    return data;
  }
};

export const changePassword = (
  id: string,
  body: {
    password: string;
  }
): Promise<boolean> => {
  return axios.put(`${BASE_API}/api/v1/users/change-password/${id}`, body);
};
