import axios from "axios";
import { IModulo } from "../interfaces/Modulo";
import { IPermisos } from "../interfaces/Permisos";
import { BASE_API } from "../utils/const";

export const getPermisos = async () => {
  const { data } = await axios.get<IModulo[]>(
    `${BASE_API}/api/v1/resources/list`
  );
  return data;
};

export const getPermisosToRol = async (id: string) => {
  const { data } = await axios.get(`${BASE_API}/api/v1/resources/role/${id}`);
  return data;
};

export const getPermisosByRol = async (id: string) => {
  const { data } = await axios.get(
    `${BASE_API}/api/v1/resources-roles/role/${id}`
  );
  return data;
};

export const getPermisosByUser = async (id: string) => {
  const { data } = await axios.get(
    `${BASE_API}/api/v1/resources-users/user/${id}`
  );
  return data;
};

export const createOrUpdatePermiso = async (
  body: IPermisos,
  idData?: string
) => {
  if (idData) {
    const { data } = await axios.put(
      `${BASE_API}/api/v1/resources/${idData}`,
      body
    );
    return data;
  } else {
    const { data } = await axios.post(`${BASE_API}/api/v1/resources`, body);
    return data;
  }
};

export const createPermisoRole = async (body: any, idData?: string) => {
  //create
  const { data } = await axios.post(`${BASE_API}/api/v1/resources-roles`, body);
  return data;
};

export const createPermsisoUser = async (body: any, idData?: string) => {
  //create
  const { data } = await axios.post(`${BASE_API}/api/v1/resources-users`, body);
  return data;
};

export const findModuloByUser = async (id: string) => {
  const { data } = await axios.get(
    `${BASE_API}/api/v1/services-users/user/${id}`
  );

  return data;
};
