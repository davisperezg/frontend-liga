import axios from "axios";
import { BASE_API } from "../utils/const";

export const findServiceByUser = async (id: string) => {
  const { data } = await axios.get(
    `${BASE_API}/api/v1/services-users/user/${id}`
  );

  return data;
};
