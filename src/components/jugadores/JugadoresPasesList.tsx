import { useState } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import "../../styles/jugadores.css";
import JugadoresPaseForm from "./JugadoresPaseForm";

const JugadoresPasesList = () => {
  const [show, setShow] = useState<boolean>(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {show && <JugadoresPaseForm show={show} handleClose={handleClose} />}
      <div className="pases__header">
        <Button variant="primary" onClick={handleShow}>
          Crear pases
        </Button>
      </div>
      <div className="pases__content">
        <Table responsive striped bordered hover size="sm" variant="dark">
          <thead>
            <tr>
              <th className="table--center table--30">#</th>
              <th>Club</th>
              <th className="table--center table--30">Cantidad</th>
              <th className="table--180">Fecha creación</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="table--center">1</td>
              <td>Real Fujimori</td>
              <td className="table--center">21</td>
              <td>08-02-2023 20:14</td>
            </tr>
            <tr>
              <td className="table--center">1</td>
              <td>Real Fujimori</td>
              <td className="table--center">21</td>
              <td>08-02-2023 20:14</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default JugadoresPasesList;
