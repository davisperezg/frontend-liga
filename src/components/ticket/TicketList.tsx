import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useMemo, useState, useRef, useCallback, useContext } from "react";
import { createTicket, getTicket } from "../../api/ticket";
import { useQueryClient, useMutation } from "react-query";
import { useReactToPrint } from "react-to-print";
import useFullPageLoader from "../../hooks/useFullPageLoader";
import QRCode from "react-qr-code";
import { formatDate, formatter } from "../../utils/functions";

interface IProps {
  productos: any[];
  setProductos: (param: any) => void;
  setProductoEdit: (param: any) => void;
  ticket: number;
  setTicket: (param: any) => void;
  initialEdit: any;
}

interface IDtailsPrint {
  producto: string;
  cantidad: number;
  precio: number;
}

interface IPrint {
  _id: string;
  liga: string;
  nroTicket: number;
  createdAt: Date;
  tipoTicket: string;
  createdBy: string;
  metodo: string;
  details: IDtailsPrint[];
  status: boolean;
  pagoCon: number;
}

const initialPrint: IPrint = {
  _id: "",
  liga: "",
  nroTicket: 0,
  createdAt: new Date(),
  tipoTicket: "",
  createdBy: "",
  metodo: "",
  details: [],
  status: false,
  pagoCon: 0,
};

const TicketList = ({
  productos,
  setProductos,
  setProductoEdit,
  ticket,
  setTicket,
  initialEdit,
}: IProps) => {
  const queryClient = useQueryClient();
  const componentRef = useRef(null);
  const [ticketPrint, setTicketPrint] = useState<IPrint>(initialPrint);
  const [loader, showLoader, hideLoader]: any = useFullPageLoader();
  const { isLoading: isLoadingForm, mutateAsync: mutateForm } = useMutation({
    mutationFn: (values: any) => createTicket(values),
    onSuccess: () => {
      queryClient.invalidateQueries(["one.secuencia"]);
      queryClient.invalidateQueries(["tickets"]);
    },
  });

  const [amount, setAmount] = useState<number>(0);

  const deleteProducto = (item: any) => {
    const kick = productos.filter((a) => a.producto !== item.producto);
    setProductos(kick);
  };

  const editProducto = (item: any) => {
    setProductoEdit({ ...item, modified: true });
  };

  const calcTotal = useMemo(() => {
    const sum = productos.reduce(
      (acc, curr) => acc + curr.detailProducto.costo * curr.cantidad,
      0
    );

    setAmount(sum);

    return sum;
  }, [productos]);

  const calcCant = useMemo(() => {
    return productos.reduce((acc, curr) => acc + curr.cantidad, 0);
  }, [productos]);

  const genTicket = async () => {
    if (productos.length <= 0) return alert("No hay productos en el carrito");
    showLoader();
    const justIdsProducts = productos.map((a) => {
      return {
        nroTicket: ticket,
        producto: a.producto,
        cantidad: a.cantidad,
        precio: a.detailProducto.costo,
      };
    });

    try {
      const res = await mutateForm({
        nroTicket: ticket,
        details: justIdsProducts,
        pagoCon: amount,
      });
      const ticketP = await getTicket(String(res.seq.nroTicket));
      setTicketPrint(ticketP.response);
      handlePrint();
    } catch (error: any) {
      const err = error.response.data;
      alert(err.message);
      hideLoader();
    }
  };

  const handleOnBeforeGetContent = useCallback(async () => {
    return new Promise((resolve: any) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }, [ticket]);

  const handleAfterPrint = useCallback(async () => {
    setTicketPrint(initialPrint);
    setProductos([]);
    setTicket(0);
    setProductoEdit(initialEdit);
  }, []);

  const handleBeforePrint = useCallback(async () => {
    hideLoader();
  }, [hideLoader]);

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: String(ticket),
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    onBeforeGetContent: handleOnBeforeGetContent,
    removeAfterPrint: true,
  });

  const Ticket = () => (
    <div className="print" ref={componentRef}>
      <div className="ticketPrint">
        {/* <img
          className={styles.ticket__img}
          src="https://logodownload.org/wp-content/uploads/2016/03/ticket-logo.png"
          alt="Logotipo"
        /> */}
        <h1 className="ticket__centrado">LIGA DE SANTA MARIA</h1>
        <p className="ticket__centrado">
          TICKET DE VENTA
          <br />
          {String(ticketPrint.liga)} - {ticketPrint.nroTicket}
          <br />
          {formatDate(new Date(ticketPrint.createdAt))}
        </p>
        <div className="ticket__centrado_noMargin">
          <strong>VENDEDOR: </strong>
          {ticketPrint.createdBy}
        </div>
        <p className="ticket__centrado">
          {ticketPrint.tipoTicket} - {ticketPrint.metodo}
        </p>
        <div className="ticket__centrado_Table">
          <table>
            <h1 className="canceled">
              {ticketPrint.status === false && "ANULADO"}
            </h1>
            <thead>
              <tr>
                <th className="cantidad">CANT</th>
                <th className="producto">PROD.</th>
                <th className="pu">P. U.</th>
                <th className="descuento"></th>
                <th className="total">S/</th>
              </tr>
            </thead>
            <tbody>
              {ticketPrint.details?.map((dtls, i) => {
                return (
                  <tr key={i}>
                    <td className="cantidad">{dtls.cantidad}</td>
                    <td className="producto">{dtls.producto}</td>
                    <td className="pu">{formatter.format(dtls.precio)}</td>
                    <th className="descuento"></th>
                    <td className="total">
                      {/* dtls.precio - dtls.descuento DESCUENTO APLICADO */}
                      {/* dtls.precio DESCUENTO NO APLICADO */}
                      {formatter.format(dtls.precio * dtls.cantidad)}
                    </td>
                  </tr>
                );
              })}

              {ticketPrint.metodo === "EFECTIVO CON VUELTO" ? (
                <>
                  <tr className="ticket__tr">
                    <td></td>
                    <td>
                      <strong>TOTAL</strong>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="ticket__soles">
                      <div className="iconAndSoles">
                        <div>S/</div>
                        <div className="iconAndSoles__soles">
                          {formatter.format(calcTotal)}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="ticket__tr">
                    <td></td>
                    <td>
                      <strong>PAGO CON</strong>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="ticket__soles">
                      <div className="iconAndSoles">
                        <div>S/</div>
                        <div className="iconAndSoles__soles">
                          {formatter.format(ticketPrint.pagoCon)}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="ticket__tr">
                    <td></td>
                    <td>
                      <strong>VUELTO</strong>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="ticket__soles">
                      <div className="iconAndSoles">
                        <div>S/</div>
                        <div className="iconAndSoles__soles">
                          {formatter.format(ticketPrint.pagoCon - calcTotal)}
                        </div>
                      </div>
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  <tr className="ticket__tr">
                    <td></td>
                    <td>
                      <strong>TOTAL</strong>
                    </td>
                    <td></td>
                    <td></td>
                    <td className="ticket__soles">
                      <div className="iconAndSoles">
                        <div>S/</div>
                        <div className="iconAndSoles__soles">
                          {formatter.format(calcTotal)}
                        </div>
                      </div>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
        <div className="qr">
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={ticketPrint._id}
            viewBox={`0 0 256 256`}
          />
        </div>
        <div className="id__qr">{ticketPrint._id}</div>
        <p className="ticket__centrado">
          ¡GRACIAS POR SU COMPRA!
          <br />
          www.davisperezg.com
        </p>
      </div>
    </div>
  );

  return (
    <div className="ticket__list">
      <div style={{ display: "none" }}>
        <Ticket />
      </div>
      <label>Carrito</label>
      <div>
        <Table responsive striped bordered hover size="sm" variant="dark">
          <thead>
            <tr>
              <th className="ticket__th30center-list">#</th>
              <th className="ticket__th80center-list">Tipo</th>
              <th>Cliente</th>
              <th className="ticket__center-list">P. Unit</th>
              <th className="ticket__th30center-list">Cant.</th>
              <th className="ticket__th30center-list">S.Total</th>
              <th className="ticket__th30center-list">Editar</th>
              <th className="ticket__th30center-list">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((a, i) => {
              return (
                <tr key={i + 1}>
                  <td className="ticket__center-list">{i + 1}</td>
                  <td className="ticket__center-list">{a.tipo}</td>
                  <td>{a.detailProducto.usuario}</td>
                  <td className="ticket__center-list">
                    S/{a.detailProducto.costo}
                  </td>
                  <td className="ticket__center-list">{a.cantidad}</td>
                  <td className="ticket__center-list">
                    S/{a.detailProducto.costo * a.cantidad}
                  </td>
                  <td
                    onClick={() => editProducto(a)}
                    className="ticket__center-list"
                    style={{ color: "yellow", cursor: "pointer" }}
                  >
                    Edit
                  </td>
                  <td
                    onClick={() => deleteProducto(a)}
                    className="ticket__center-list"
                    style={{ color: "red", cursor: "pointer" }}
                  >
                    X
                  </td>
                </tr>
              );
            })}
            <tr>
              <td
                colSpan={4}
                style={{
                  textAlign: "right",
                  userSelect: "none",
                }}
              ></td>
              <td style={{ textAlign: "right" }}>
                <strong>Total</strong>
              </td>
              {/* <td className="ticket__center-list">
                <small>{calcCant} ticks</small>
              </td> */}
              <td className="ticket__center-list" colSpan={1}>
                <strong>S/{calcTotal}</strong>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      <div className="ticket__item">
        <label className="ticket__text" htmlFor="">
          Con cuanto esta pagando el cliente?{" "}
          <strong>El total es de S/{calcTotal} soles</strong>
        </label>
        <input
          className="ticket__input"
          type="number"
          onChange={(e) => {
            if (productos.length <= 0) {
              return alert("Ingrese productos al carrito");
            }

            const value = Number(e.target.value);

            return setAmount(value);
          }}
          value={amount}
          placeholder="Con cuanto esta pagando el cliente?"
        />
      </div>
      <div className="ticket__item">
        <label
          style={{
            color: Number(amount - calcTotal) < 0 ? "yellow" : "#fff",
          }}
          className="ticket__text"
          htmlFor=""
        >
          {Number(amount - calcTotal) < 0 ? (
            <strong>
              El cliente debe pagar igual o superior al monto total
            </strong>
          ) : (
            <strong style={{ textDecoration: "underline" }}>
              Su vuelto para dar al cliente es de (S/)
            </strong>
          )}
        </label>
        <input
          style={{
            backgroundColor: Number(amount - calcTotal) < 0 ? "red" : "#3a3b3c",
          }}
          className="ticket__input"
          disabled
          placeholder="0.00"
          value={Number(amount - calcTotal)}
        />
      </div>
      {loader}
      <Button
        onClick={genTicket}
        disabled={productos.length <= 0 ? true : isLoadingForm}
        size="lg"
        className="ticket__btn"
        variant="success"
      >
        {isLoadingForm ? "GENERANDO..." : "GENERAR TICKET"}
      </Button>
    </div>
  );
};

export default TicketList;
