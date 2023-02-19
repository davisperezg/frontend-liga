import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useMemo, useState } from "react";
import UsuarioForm from "./UsuarioForm";
import { IUsuario } from "../../interfaces/Usuario";
import { useQuery } from "react-query";
import { getUsers } from "../../api/usuarios";
import RolItem from "../roles/RolItem";
import UsuarioItem from "./UsuarioItem";
import UsuarioEdit from "./UsuarioEdit";

const initialValue: IUsuario = {
  name: "",
  lastname: "",
  tipDocument: "DNI",
  nroDocument: "",
  role: "NULL",
  email: "",
  liga: "SANTA MARIA",
};

const UsuarioList = () => {
  //data
  const [dataEdit, setDataEdit] = useState<IUsuario>(initialValue);

  //crear
  const [show, setShow] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //editar
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const handleCloseEdit = () => {
    setShowEdit(false);
    setDataEdit(initialValue);
  };
  const handleShowEdit = (data: IUsuario) => {
    setShowEdit(true);
    setDataEdit(data);
  };

  const {
    isLoading: isLoadingUsuarios,
    error: isErrorUsuarios,
    data: dataUsuarios,
  } = useQuery({
    queryKey: ["usuarios"],
    queryFn: async () => await getUsers(),
  });

  const reformated = useMemo(() => {
    if (!dataUsuarios) return [];

    return dataUsuarios.sort((a, b) => a.name.localeCompare(b.name));
  }, [dataUsuarios]);

  return (
    <>
      {show && (
        <UsuarioForm
          show={show}
          handleClose={handleClose}
          initialValue={initialValue}
        />
      )}

      {showEdit && (
        <UsuarioEdit
          show={showEdit}
          handleClose={handleCloseEdit}
          usuario={dataEdit}
        />
      )}

      <div className="usuarios__header">
        <Button variant="primary" onClick={handleShow}>
          Crear usuario
        </Button>
      </div>

      <div className="usuarios__content">
        {isLoadingUsuarios ? (
          isErrorUsuarios ? (
            (isErrorUsuarios as Error).message
          ) : (
            "Cargando usuarios..."
          )
        ) : (
          <Table responsive striped bordered hover size="sm" variant="dark">
            <thead>
              <tr>
                <th className="table--center table--30">#</th>
                <th>Nombre completo</th>
                <th>Rol</th>
                <th>Tipo de documento</th>
                <th>Nro de documento</th>
                <th>Correo</th>
                <th>Liga</th>
                <th>Estado</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {reformated.map((a, i) => {
                return (
                  <UsuarioItem
                    key={a._id}
                    contador={i}
                    usuario={a}
                    handleShowEdit={handleShowEdit}
                  />
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
    </>
  );
};

export default UsuarioList;
