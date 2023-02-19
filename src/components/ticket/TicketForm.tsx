import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Button from "react-bootstrap/Button";
import { useQuery } from "react-query";
import { getPrecios } from "../../api/precios";
import { getSecuencia } from "../../api/secuencia";
import { AuthContext } from "../../context";
import { IDetailTicket } from "../../interfaces/Ticket";

interface IProps {
  addProducto: (producto: any) => void;
  productoEdit: any;
  setProductoEdit: (producto: any) => void;
  setTicket: (nro: number) => void;
  initialEdit: any;
}

const initialValue = {
  nroTicket: 0,
  tipo: "Venta",
  producto: "",
  cantidad: 1,
};

const TicketForm = ({
  addProducto,
  productoEdit,
  setProductoEdit,
  setTicket,
  initialEdit,
}: IProps) => {
  const [values, setValues] = useState<any>(initialValue);
  //Para ticketear se necesita obtener la secuencia de la liga del usuario
  const { user } = useContext(AuthContext);
  const {
    isLoading: isLoadingSecuencia,
    error: errorSecuencia,
    data: dataSecuencia,
  } = useQuery({
    queryKey: ["one.secuencia", user.liga],
    queryFn: async () => await getSecuencia(user.liga),
  });

  //Para ticketear se necesita obtener los precios de la liga del usuario
  const {
    isLoading: isLoadingPrecios,
    error: errorPrecios,
    data: dataPrecios,
  } = useQuery({
    queryKey: ["precios"],
    queryFn: async () => await getPrecios(),
  });

  const handleChange2 =
    (prop: keyof any) => (event: ChangeEvent<HTMLSelectElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleChange =
    (prop: keyof IDetailTicket) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: Number(event.target.value) });
    };

  const handleAdd = () => {
    const productoSeleccionado = values.producto;

    const insertDetailProducto = dataPrecios.response.find(
      (a: any) => String(a._id) === String(productoSeleccionado)
    );

    const sendDataList = {
      ...values,
      nroTicket: dataSecuencia.response.secuencia,
      detailProducto: {
        _id: insertDetailProducto._id,
        costo: insertDetailProducto.costo,
        usuario: insertDetailProducto.usuario,
      },
      modified: productoEdit.producto,
    };

    //obtener nro de ticket hacia TicketScreen
    setTicket(dataSecuencia.response.secuencia);

    addProducto(sendDataList);

    //modified to false
    setProductoEdit(initialEdit);

    setValues({
      ...values,
      cantidad: 1,
      producto: dataPrecios.response[0]._id,
    });
  };

  const loadData = useCallback(() => {
    if (dataPrecios && dataPrecios.response) {
      setValues({ ...values, producto: dataPrecios.response[0]._id });
    }
  }, [dataPrecios]);

  const loadChanges = useCallback(() => {
    if (productoEdit.modified === true) {
      setValues({
        ...values,
        producto: productoEdit.producto,
        cantidad: productoEdit.cantidad,
      });
    }
  }, [productoEdit]);

  useEffect(() => {
    loadData();
    loadChanges();
  }, [loadData, loadChanges]);

  return (
    <div className="ticket__form">
      <label className="ticket__text" htmlFor="select_cli">
        Ticket Nro:
        {isLoadingSecuencia ? (
          "Cargando secuencia"
        ) : dataSecuencia.response === null ? (
          <strong style={{ color: "red" }}> Estas ingresando como root</strong>
        ) : (
          <strong>
            {dataSecuencia.response.secuencia < 10
              ? " 0" + dataSecuencia.response.secuencia
              : " " + dataSecuencia.response.secuencia}
          </strong>
        )}
      </label>
      <div className="ticket__section">
        {/* POR DEFECTO EL CLIENTE SERA ADULTO */}
        <div className="ticket__item">
          <label className="ticket__text" htmlFor="select_cli">
            Ingrese producto
          </label>
          {isLoadingPrecios ? (
            "Cargando productos..."
          ) : (
            <select
              onChange={handleChange2("producto")}
              value={values.producto}
              className="ticket__select"
            >
              {dataPrecios.response.map((a: any) => {
                return (
                  <option key={a._id} value={a._id}>
                    {a.usuario}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        {/* POR DEFECTO LA CANTIDAD SERA 1 */}
        <div className="ticket__item">
          <label className="ticket__text" htmlFor="">
            Ingrese cantidad
          </label>
          <input
            onChange={handleChange("cantidad")}
            value={values.cantidad}
            className="ticket__input"
            type="number"
            autoFocus
          />
        </div>

        {/* ACCESO RAPIDO PARA LA CANTIDAD DE TICKETS */}
        <div className="ticket__item">
          <label className="ticket__text ticket__text--modifier" htmlFor="">
            Acceso directo cantidad de tickets
          </label>
          <div className=" ticket__grid">
            <div
              onClick={() => setValues({ ...values, cantidad: 2 })}
              className="ticket__griditem"
            >
              2
            </div>
            <div
              onClick={() => setValues({ ...values, cantidad: 3 })}
              className="ticket__griditem"
            >
              3
            </div>
            <div
              onClick={() => setValues({ ...values, cantidad: 4 })}
              className="ticket__griditem"
            >
              4
            </div>
            <div
              onClick={() => setValues({ ...values, cantidad: 5 })}
              className="ticket__griditem"
            >
              5
            </div>
            <div
              onClick={() => setValues({ ...values, cantidad: 6 })}
              className="ticket__griditem"
            >
              6
            </div>
            <div
              onClick={() => setValues({ ...values, cantidad: 10 })}
              className="ticket__griditem"
            >
              10
            </div>
          </div>
        </div>
      </div>

      {/* AGREGAR PRODUCTO */}
      <Button
        onClick={handleAdd}
        size="lg"
        className="ticket__btn"
        variant="primary"
      >
        {productoEdit.modified ? "Modificar producto" : "Agregar producto"}
      </Button>
    </div>
  );
};

export default TicketForm;
