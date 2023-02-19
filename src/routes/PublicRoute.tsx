import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context";
//import { AuthContext } from "../stateManagement/context";

const PublicRoute = ({ children }: any) => {
  const { user } = useContext(AuthContext);

  if (
    !user ||
    user?.status === false ||
    !localStorage.getItem("access_token") ||
    !localStorage.getItem("refresh_token")
  )
    localStorage.clear();

  return user?.status === true && localStorage.getItem("access_token") ? (
    <Navigate to="/" />
  ) : (
    children
  );
};

export default PublicRoute;
