import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useState, useMemo } from "react";
import ModuloForm from "./ModuloForm";
import { getModules } from "../../api/modulos";
import { useQuery } from "react-query";
import ModuloItem from "./ModuloItem";
import ModuloEdit from "./ModuloEdit";
import { IModulo } from "../../interfaces/Modulo";

const initialValue: IModulo = {
  name: "",
  menu: [],
};

const ModuloList = () => {
  //data
  const [dataEdit, setDataEdit] = useState<IModulo>(initialValue);

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
  const handleShowEdit = (data: IModulo) => {
    setShowEdit(true);
    setDataEdit(data);
  };

  const {
    isLoading: isLoadingModulos,
    error: isErrorModulos,
    data: dataModulos,
  } = useQuery({
    queryKey: ["modulos.list"],
    queryFn: async () => await getModules(),
  });

  const reformated = useMemo(() => {
    if (!dataModulos) return [];

    return dataModulos.sort((a, b) => a.name.localeCompare(b.name));
  }, [dataModulos]);

  return (
    <>
      {show && (
        <ModuloForm
          show={show}
          handleClose={handleClose}
          initialValue={initialValue}
        />
      )}
      {showEdit && (
        <ModuloEdit
          show={showEdit}
          handleClose={handleCloseEdit}
          modulo={dataEdit}
        />
      )}

      <div className="modulos__header">
        <Button variant="primary" onClick={handleShow}>
          Crear modulo
        </Button>
      </div>

      <div className="pases__content">
        {isLoadingModulos ? (
          isErrorModulos ? (
            (isErrorModulos as Error).message
          ) : (
            "Cargando modulos..."
          )
        ) : (
          <Table responsive striped bordered hover size="sm" variant="dark">
            <thead>
              <tr>
                <th className="table--center table--30">#</th>
                <th>Nombre</th>
                <th>Fecha creada</th>
                <th>Fecha actualizada</th>
                <th>Estado</th>
                <th className="table--center">Editar</th>
                <th className="table--center">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {reformated?.map((a, i) => {
                return (
                  <ModuloItem
                    key={a._id}
                    contador={i}
                    modulo={a}
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

export default ModuloList;
