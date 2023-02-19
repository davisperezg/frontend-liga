import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context";
//import { AuthContext } from "../stateManagement/context";

const PrivateRoute = ({ children }: any) => {
  const { user } = useContext(AuthContext);
  if (
    !user ||
    user?.status === false ||
    !localStorage.getItem("access_token") ||
    !localStorage.getItem("refresh_token")
  )
    localStorage.clear();

  //return
  return user?.status === true && localStorage.getItem("access_token") ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
