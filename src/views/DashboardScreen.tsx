import { useContext } from "react";
import Table from "react-bootstrap/Table";
import { AuthContext } from "../context";
import "../styles/inicio.css";
import VerificarQRScreen from "./VerificarQRScreen";

const DashboardScreen = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="principal">
      <div className="principal__bienvenida">
        <small>Bienvenido al sistema: {user.fullname}</small>
      </div>
      <section className="principal__item">
        {/* <h3>Ultimas conexiones al sistema</h3>
        <Table responsive striped bordered hover size="sm" variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Usuario</th>
              <th>Inicio de conexion</th>
              <th>Tiempo conectado</th>
              <th>Ultima conexion</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Keiner</td>
              <td>08-02-2023 20:14</td>
              <td>56min</td>
              <td>08-02-2023 21:14</td>
            </tr>
            <tr>
              <td>1</td>
              <td>Keiner</td>
              <td>08-02-2023 20:14</td>
              <td>56min</td>
              <td>08-02-2023 21:14</td>
            </tr>
          </tbody>
        </Table> */}
      </section>
      {/* ESTE CONTENIDO SE VERA SI EL USUARIO TIENE EL PERMISO DE  VERIFICAR QR  */}
      <VerificarQRScreen />
    </div>
  );
};

export default DashboardScreen;
