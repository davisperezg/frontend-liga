import { ISecuencia } from "../../interfaces/Secuencia";

interface IProps {
  secuencia: ISecuencia;
  contador: number;
  handleShowEdit: (data: ISecuencia) => void;
}

const SecuenciaItem = ({ secuencia, contador, handleShowEdit }: IProps) => {
  return (
    <tr>
      <td className="table--center">{contador + 1}</td>
      <td>{secuencia.liga}</td>
      <td>{secuencia.secuencia}</td>
      <td>{secuencia.createdAt?.toString()}</td>
      <td>{secuencia.updatedAt?.toString()}</td>
      <td
        onClick={() => handleShowEdit(secuencia)}
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

export default SecuenciaItem;
