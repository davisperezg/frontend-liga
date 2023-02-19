import axios from "axios";
import { getRefresh } from "../api/auth";
import { BASE_API } from "./const";

export function jwtInterceptor() {
  axios.interceptors.request.use((request) => {
    // add auth header with jwt if account is logged in and request is to the api url
    const isLoggedIn = localStorage.getItem("access_token");
    const isApiUrl = request.url?.startsWith(String(BASE_API));

    if (isLoggedIn && isApiUrl) {
      request.headers!["Authorization"] = `Bearer ${isLoggedIn}`;
    }

    return request;
  });

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
      if (
        error.response.status === 401 &&
        originalRequest.url === `${BASE_API}/api/v1/auth/login/token`
      ) {
        return Promise.reject(error);
      }

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const { user } = JSON.parse(String(localStorage.getItem("user")));
          const refreshToken = localStorage.getItem("refresh_token");
          const resToken: any = await getRefresh(
            String(user.username),
            String(refreshToken)
          );
          if (resToken.status === 201) {
            localStorage.setItem("access_token", resToken.data.access_token);
            const token = localStorage.getItem("access_token");
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            return axios(originalRequest);
          }
        } catch (e) {
          window.location.href = "/login";
          localStorage.clear();
        }
      }

      return Promise.reject(error);
    }
  );
}
