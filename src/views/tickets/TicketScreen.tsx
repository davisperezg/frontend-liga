import { useContext, useState } from "react";
import TicketForm from "../../components/ticket/TicketForm";
import TicketList from "../../components/ticket/TicketList";
import "../../styles/ticket.css";

const initialEdit = {
  producto: "",
  cantidad: 1,
};

const TicketScreen = () => {
  const [ticket, setTicket] = useState<number>(0);
  const [productos, setProductos] = useState<any[]>([]);
  const [productoEdit, setProductoEdit] = useState<any>(initialEdit);

  const addProducto = (dataForm: any) => {
    const { producto, modified, cantidad } = dataForm;
    const existProducto = productos.find((a) => a.producto === producto);

    //Si modified es false y existe producto en el carrito
    if (!modified && existProducto) {
      return alert(
        `Ya existe el producto ${existProducto.detailProducto.usuario} en el carrito. Solo puede modificarlo haciendo click en "Edit" del producto ${existProducto.detailProducto.usuario}.`
      );
    }

    //si es modified es true y existe en el carrito
    if (modified && existProducto) {
      //Elimino al que ya tenia antes - op1
      //const kickAntes = productos.filter((a) => a.producto !== producto);
      //Buscar mismo producto de mi array y remplazo lo que se cambia como la cantidad - opt2
      const kickAntes = productos.map((a) => {
        return {
          ...a,
          cantidad: a.producto === producto ? cantidad : a.cantidad,
        };
      });
      //const unirNuevo = [dataForm, ...kickAntes];
      setProductos(kickAntes);
      return;
    }

    //si no existe producto en el carrito
    setProductos([...productos, dataForm]);
  };

  return (
    <div className="ticket">
      <TicketList
        productos={productos}
        setProductoEdit={setProductoEdit}
        setProductos={setProductos}
        ticket={ticket}
        setTicket={setTicket}
        initialEdit={initialEdit}
      />

      <TicketForm
        addProducto={addProducto}
        setProductoEdit={setProductoEdit}
        initialEdit={initialEdit}
        productoEdit={productoEdit}
        setTicket={setTicket}
      />
    </div>
  );
};

export default TicketScreen;
