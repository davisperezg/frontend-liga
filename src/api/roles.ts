import axios from "axios";
import { IRol } from "../interfaces/Rol";
import { BASE_API } from "../utils/const";

export const getRoles = async () => {
  const { data } = await axios.get<IRol[]>(`${BASE_API}/api/v1/roles`);
  return data;
};

export const getRole = async (id: string) => {
  const { data } = await axios.get<IRol>(`${BASE_API}/api/v1/roles/find/${id}`);
  return data;
};

export const deleteRole = async (id: string) => {
  const { data } = await axios.delete<boolean>(
    `${BASE_API}/api/v1/roles/${id}`
  );
  return data;
};

export const createOrUpdateRol = async (body: IRol, id?: string) => {
  if (id) {
    const { data } = await axios.put<any>(
      `${BASE_API}/api/v1/roles/${id}`,
      body
    );
    return data;
  } else {
    const { data } = await axios.post<any>(`${BASE_API}/api/v1/roles`, body);
    return data;
  }
};

export const restoreRole = async (id: string) => {
  const { data } = await axios.put<boolean>(
    `${BASE_API}/api/v1/roles/restore/${id}`
  );

  return data;
};
