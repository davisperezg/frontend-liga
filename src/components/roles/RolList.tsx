import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import RolForm from "./RolForm";
import { IRol } from "../../interfaces/Rol";
import { useState, useMemo } from "react";
import { getModules } from "../../api/modulos";
import { useQuery } from "react-query";
import { getRoles } from "../../api/roles";
import RolItem from "./RolItem";
import RolEdit from "./RolEdit";

const initialValue: IRol = {
  name: "",
  description: "",
  module: [],
};

const RolList = () => {
  //data
  const [dataEdit, setDataEdit] = useState<IRol>(initialValue);

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
  const handleShowEdit = (data: IRol) => {
    setShowEdit(true);
    setDataEdit(data);
  };

  const {
    isLoading: isLoadingRoles,
    error: isErrorRoles,
    data: dataRoles,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => await getRoles(),
  });

  const reformated = useMemo(() => {
    if (!dataRoles) return [];

    return dataRoles.sort((a, b) => a.name.localeCompare(b.name));
  }, [dataRoles]);

  return (
    <>
      {show && (
        <RolForm
          show={show}
          handleClose={handleClose}
          initialValue={initialValue}
        />
      )}
      {showEdit && (
        <RolEdit show={showEdit} handleClose={handleCloseEdit} rol={dataEdit} />
      )}

      <div className="roles__header">
        <Button variant="primary" onClick={handleShow}>
          Crear rol
        </Button>
      </div>

      <div className="roles__content">
        {isLoadingRoles ? (
          isErrorRoles ? (
            (isErrorRoles as Error).message
          ) : (
            "Cargando roles"
          )
        ) : (
          <Table responsive striped bordered hover size="sm" variant="dark">
            <thead>
              <tr>
                <th className="table--center table--30">#</th>
                <th>Rol</th>
                <th>Creador</th>
                <th>Fecha creada</th>
                <th>Fecha actualizada</th>
                <th>Estado</th>
                <th className="table--center">Editar</th>
                <th className="table--center">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {reformated.map((a, i) => {
                return (
                  <RolItem
                    key={a._id}
                    contador={i}
                    rol={a}
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

export default RolList;
