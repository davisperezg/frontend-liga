import axios from "axios";
import { CheckboxOption } from "../interfaces/Checkbox";
import { IModulo } from "../interfaces/Modulo";
import { BASE_API } from "../utils/const";

export const getModulesToRol = async () => {
  const { data } = await axios.get<CheckboxOption[]>(
    `${BASE_API}/api/v1/modules`
  );
  return data;
};

//listar modulos
export const getModules = async () => {
  const { data } = await axios.get<IModulo[]>(
    `${BASE_API}/api/v1/modules/list`
  );
  return data;
};

//cambiar de estado a eliminado a un modulo
export const deleteModule = async (id: string) => {
  const { data } = await axios.delete<boolean>(
    `${BASE_API}/api/v1/modules/${id}`
  );

  return data;
};

//crear o actualizar modulo
export const createOrUpdateModule = async (body: IModulo, id?: string) => {
  if (id) {
    const { data } = await axios.put<any>(
      `${BASE_API}/api/v1/modules/${id}`,
      body
    );
    return data;
  } else {
    const { data } = await axios.post<any>(`${BASE_API}/api/v1/modules`, body);
    return data;
  }
};

//cambiar de estado a "habilitado" a un modulo
export const restoreModel = async (id: string) => {
  const { data } = await axios.put<boolean>(
    `${BASE_API}/api/v1/modules/restore/${id}`
  );

  return data;
};

export const createModulosUser = async (body: any, idData?: string) => {
  const { data } = await axios.post(`${BASE_API}/api/v1/services-users`, body);

  return data;
};
