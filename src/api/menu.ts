import { IMenu } from "../interfaces/Menu";
import { BASE_API } from "../utils/const";
import axios from "axios";

export const getMenus = async () => {
  const { data } = await axios.get<IMenu[]>(`${BASE_API}/api/v1/menus`);
  return data;
};
