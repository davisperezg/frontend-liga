import { useContext, useState, useMemo } from "react";
import SecuenciaEdit from "../components/secuencia/SecuenciaEdit";
import SecuenciaForm from "../components/secuencia/SecuenciaForm";
import { AuthContext } from "../context";
import { ISecuencia } from "../interfaces/Secuencia";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import SecuenciaItem from "../components/secuencia/SecuenciaItem";
import { getSecuencias } from "../api/secuencia";
import { useQuery } from "react-query";

const SecuenciaScreen = () => {
  const { user } = useContext(AuthContext);
  const initialValue: ISecuencia = {
    liga: user.liga ? user.liga : "NULL",
    secuencia: 0,
  };

  const [show, setShow] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //editar
  const [dataEdit, setDataEdit] = useState<ISecuencia>(initialValue);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const handleCloseEdit = () => {
    setShowEdit(false);
    setDataEdit(initialValue);
  };
  const handleShowEdit = (data: ISecuencia) => {
    setShowEdit(true);
    setDataEdit(data);
  };

  const {
    isLoading: isLoadingSecuencias,
    error: isErrorSecuencias,
    data: dataSecuencias,
  } = useQuery({
    queryKey: ["secuencias"],
    queryFn: async () => await getSecuencias(),
  });

  const reformated = useMemo(() => {
    if (!dataSecuencias) return [];

    const { response } = dataSecuencias as any;

    return response || [];
  }, [dataSecuencias]);

  return (
    <div className="precios">
      {show && (
        <SecuenciaForm
          show={show}
          handleClose={handleClose}
          initialValue={initialValue}
        />
      )}

      {showEdit && (
        <SecuenciaEdit
          show={showEdit}
          handleClose={handleCloseEdit}
          secuencia={dataEdit}
        />
      )}

      <div className="pases__header">
        <Button variant="primary" onClick={handleShow}>
          Crear secuencia
        </Button>
      </div>
      <div className="pases__content">
        {isLoadingSecuencias ? (
          isErrorSecuencias ? (
            (isErrorSecuencias as Error).message
          ) : (
            "Cargando secuencias"
          )
        ) : (
          <Table responsive striped bordered hover size="sm" variant="dark">
            <thead>
              <tr>
                <th className="table--center table--30">#</th>
                <th>Liga</th>
                <th>Secuencia</th>
                <th>Fecha creada</th>
                <th>Fecha actualizada</th>
                <th className="table--center">Editar</th>
              </tr>
            </thead>
            <tbody>
              {reformated.map((a: any, i: number) => {
                return (
                  <SecuenciaItem
                    key={a._id}
                    secuencia={a}
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

export default SecuenciaScreen;
