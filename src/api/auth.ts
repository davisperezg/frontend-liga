import axios from "axios";
import { BASE_API } from "../utils/const";

export const apitTime = async () => {
  const { data } = await axios.get(`${BASE_API}/api/v1/auth/login/time`);
  return data;
};

export const postLogin = async (email: string, password: string) => {
  return await axios.post(`${BASE_API}/api/v1/auth/login`, {
    email,
    password,
  });
};

export const whois = async () => {
  return await axios.get(`${BASE_API}/api/v1/users/whois`);
};

export const getRefresh = async (email: string, refreshToken: string) => {
  return await axios.post(`${BASE_API}/api/v1/auth/login/token`, {
    email,
    refreshToken,
  });
};
