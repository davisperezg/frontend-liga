import { IPrecio } from "../../interfaces/Precio";

interface IProps {
  precio: IPrecio;
  contador: number;
  handleShowEdit: (data: IPrecio) => void;
}

const PrecioItem = ({ precio, contador, handleShowEdit }: IProps) => {
  return (
    <tr>
      <td className="table--center">{contador + 1}</td>
      <td>{precio.liga}</td>
      <td>{precio.usuario}</td>
      <td className="table--center">S/{precio.costo}</td>
      <td>{precio.createdAt?.toString()}</td>
      <td>{precio.updatedAt?.toString()}</td>
      <td
        onClick={() => handleShowEdit(precio)}
        style={{
          cursor: "pointer",
        }}
        className="table--center"
      >
        Edit
      </td>
    </tr>
  );
};

export default PrecioItem;
