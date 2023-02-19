import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useState, useMemo } from "react";
import PermisosForm from "./PermisosForm";
import { getPermisos } from "../../api/permisos";
import { useQuery } from "react-query";
import PermisoItem from "./PermisoItem";
import { IPermisos } from "../../interfaces/Permisos";
import PermisoEdit from "./PermisoEdit";

const initialValue: IPermisos = {
  name: "",
  description: "",
  key: "",
};

const PermisoList = () => {
  //data
  const [dataEdit, setDataEdit] = useState<IPermisos>(initialValue);

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
  const handleShowEdit = (data: IPermisos) => {
    setShowEdit(true);
    setDataEdit(data);
  };

  const {
    isLoading: isLoadingPermisos,
    error: isErrorPermisos,
    data: dataPermisos,
  } = useQuery({
    queryKey: ["permisos"],
    queryFn: async () => await getPermisos(),
  });

  const reformated = useMemo(() => {
    if (!dataPermisos) return [];

    return dataPermisos.sort((a, b) => a.name.localeCompare(b.name));
  }, [dataPermisos]);

  return (
    <>
      {show && (
        <PermisosForm
          show={show}
          handleClose={handleClose}
          initialValue={initialValue}
        />
      )}

      {showEdit && (
        <PermisoEdit
          show={showEdit}
          handleClose={handleCloseEdit}
          permiso={dataEdit}
        />
      )}

      <div className="permisos__header">
        <Button variant="primary" onClick={handleShow}>
          Crear permiso
        </Button>
      </div>

      <div className="permisos__content">
        {isLoadingPermisos ? (
          isErrorPermisos ? (
            (isErrorPermisos as Error).message
          ) : (
            "Cargando permisos..."
          )
        ) : (
          <Table responsive striped bordered hover size="sm" variant="dark">
            <thead>
              <tr>
                <th className="table--center table--30">#</th>
                <th>Permiso</th>
                <th>KEY</th>
                <th>Fecha creada</th>
                <th>Fecha actualizada</th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody>
              {reformated.map((a, i) => {
                return (
                  <PermisoItem
                    key={a._id}
                    permiso={a}
                    contador={i}
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

export default PermisoList;
