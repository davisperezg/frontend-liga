import { IPermisos } from "../../interfaces/Permisos";

interface IProps {
  permiso: IPermisos;
  contador: number;
  handleShowEdit: (data: IPermisos) => void;
}

const PermisoItem = ({ permiso, contador, handleShowEdit }: IProps) => {
  return (
    <tr>
      <td className="table--center">{contador + 1}</td>
      <td>{permiso.name}</td>
      <td>{permiso.key}</td>
      <td>{permiso.createdAt?.toString()}</td>
      <td>{permiso.updatedAt?.toString()}</td>
      <td
        onClick={() => handleShowEdit(permiso)}
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
export default PermisoItem;
