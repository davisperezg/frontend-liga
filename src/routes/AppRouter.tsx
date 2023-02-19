import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginScreen from "../views/LoginScreen";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import TodoRoute from "./TodoRoute";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginScreen />
            </PublicRoute>
          }
        />

        <Route
          path="/*"
          element={
            <PrivateRoute>
              <TodoRoute />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
