import { useContext, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import PrecioForm from "../components/precio/PrecioForm";
import { AuthContext } from "../context";
import { IPrecio } from "../interfaces/Precio";
import "../styles/precios.css";
import { useQuery } from "react-query";
import { getPrecios } from "../api/precios";
import PrecioItem from "../components/precio/PrecioItem";
import PrecioEdit from "../components/precio/PrecioEdit";

const PrecioScreen = () => {
  const { user } = useContext(AuthContext);
  const initialValue: IPrecio = {
    liga: user.liga ? user.liga : "NULL",
    costo: 0,
    usuario: "ADULTO",
  };

  const [show, setShow] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //editar
  const [dataEdit, setDataEdit] = useState<IPrecio>(initialValue);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const handleCloseEdit = () => {
    setShowEdit(false);
    setDataEdit(initialValue);
  };
  const handleShowEdit = (data: IPrecio) => {
    setShowEdit(true);
    setDataEdit(data);
  };

  const {
    isLoading: isLoadingPrecios,
    error: isErrorPrecios,
    data: dataPrecios,
  } = useQuery({
    queryKey: ["precios"],
    queryFn: async () => await getPrecios(),
  });

  const reformated = useMemo(() => {
    if (!dataPrecios) return [];

    const { response } = dataPrecios as any;

    return response || [];
  }, [dataPrecios]);

  return (
    <div className="precios">
      {show && (
        <PrecioForm
          show={show}
          handleClose={handleClose}
          initialValue={initialValue}
        />
      )}

      {showEdit && (
        <PrecioEdit
          show={showEdit}
          handleClose={handleCloseEdit}
          precio={dataEdit}
        />
      )}

      <div className="pases__header">
        <Button variant="primary" onClick={handleShow}>
          Crear precio
        </Button>
      </div>
      <div className="pases__content">
        {isLoadingPrecios ? (
          isErrorPrecios ? (
            (isErrorPrecios as Error).message
          ) : (
            "Cargando precios"
          )
        ) : (
          <Table responsive striped bordered hover size="sm" variant="dark">
            <thead>
              <tr>
                <th className="table--center table--30">#</th>
                <th>Liga</th>
                <th>Precio</th>
                <th className="table--center">Costo</th>
                <th>Fecha creada</th>
                <th>Fecha actualizada</th>
                <th className="table--center">Editar</th>
              </tr>
            </thead>
            <tbody>
              {reformated.map((a: any, i: number) => {
                return (
                  <PrecioItem
                    key={a._id}
                    precio={a}
                    contador={i}
                    handleShowEdit={handleShowEdit}
                  />
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default PrecioScreen;
