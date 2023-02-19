import { Route, Routes } from "react-router-dom";
import DashboardScreen from "../views/DashboardScreen";
import ErrorPageScreen from "../views/ErrorPageScreen";
import PasesScreen from "../views/jugadores/PasesScreen";
import ModuloScreen from "../views/ModuloScreen";
import PermisosScreen from "../views/PermisosScreen";
import PrecioScreen from "../views/PrecioScreen";
import RolScreen from "../views/RolScreen";
import RootScreen from "../views/RootScreen";
import SecuenciaScreen from "../views/SecuenciaScreen";
import TicketListScreen from "../views/tickets/TicketListScreen";
import TicketScreen from "../views/tickets/TicketScreen";
import UsuarioScreen from "../views/UsuarioScreen";

const TodoRoute = () => {
  return (
    <Routes>
      {/* 404 para /* */}
      <Route path="*" element={<ErrorPageScreen />} />
      {/* Index o dashboard */}
      <Route path="/" element={<RootScreen />}>
        <Route path="/" element={<DashboardScreen />} />
        {/* Modulos de seguridad */}
        <Route path="modulos" element={<ModuloScreen />} />
        <Route path="permisos" element={<PermisosScreen />} />
        <Route path="roles" element={<RolScreen />} />
        <Route path="usuarios" element={<UsuarioScreen />} />
        <Route path="secuencias" element={<SecuenciaScreen />} />
        <Route path="precios" element={<PrecioScreen />} />
      </Route>

      {/* Pagina para jugadores y childrens + pagina 404 */}
      <Route path="jugadores" element={<RootScreen />}>
        <Route path="*" element={<ErrorPageScreen />} />
        <Route path="pases" element={<PasesScreen />} />
      </Route>
      {/* Pagina para jugadores y childrens + pagina 404 */}
      <Route path="jugadores" element={<RootScreen />}>
        <Route path="*" element={<ErrorPageScreen />} />
        <Route path="pases" element={<PasesScreen />} />
      </Route>
      {/* Pagina para tickets y childrens + pagina 404 */}
      <Route path="tickets" element={<RootScreen />}>
        <Route path="*" element={<ErrorPageScreen />} />
        <Route path="nuevo" element={<TicketScreen />} />
        <Route path="nuevo/cortesia" element={<TicketScreen />} />
        <Route path="lista" element={<TicketListScreen />} />
      </Route>
    </Routes>
  );
};

export default TodoRoute;
