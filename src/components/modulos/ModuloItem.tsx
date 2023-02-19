import { deleteModule, restoreModel } from "../../api/modulos";
import { IModulo } from "../../interfaces/Modulo";
import { useMutation, useQueryClient } from "react-query";

interface IProps {
  modulo: IModulo;
  contador: number;
  handleShowEdit: (data: IModulo) => void;
}

const ModuloItem = ({ modulo, contador, handleShowEdit }: IProps) => {
  const queryClient = useQueryClient();
  const { isLoading: isLoadingDelete, mutate: mutateDelete } = useMutation({
    mutationFn: (id: string) => deleteModule(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["modulos.list"]);
    },
  });

  const { isLoading: isLoadingRestore, mutate: mutateRestore } = useMutation({
    mutationFn: (id: string) => restoreModel(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["modulos.list"]);
    },
  });

  const desactivar = (id: string) => {
    mutateDelete(id, {
      onError(error: any) {
        const err = error.response.data;
        if (err.status === 403) {
          alert("Acción prohibida!!");
        } else {
          alert(err.message);
        }
      },
    });
  };

  const restaurar = (id: string) => {
    mutateRestore(id, {
      onError(error: any) {
        const err = error.response.data;
        if (err.status === 403) {
          alert("Acción prohibida!!");
        } else {
          alert(err.message);
        }
      },
    });
  };

  return (
    <tr>
      <td className="table--center">{contador + 1}</td>
      <td>{modulo.name}</td>
      <td>{modulo.createdAt?.toString()}</td>
      <td>{modulo.updatedAt?.toString()}</td>
      <td>{modulo.status ? "Habilitado" : "Eliminado"}</td>
      <td
        onClick={() => handleShowEdit(modulo)}
        style={{
          cursor: "pointer",
        }}
        className="table--center"
      >
        Edit
      </td>
      <td
        style={{
          cursor: "pointer",
          userSelect: "none",
        }}
        className="table--center"
      >
        {modulo.status ? (
          <strong
            onClick={() => desactivar(String(modulo._id))}
            style={{ color: "red" }}
          >
            {isLoadingDelete ? "Eliminando" : "X"}
          </strong>
        ) : (
          <strong
            onClick={() => restaurar(String(modulo._id))}
            style={{ color: "yellow" }}
          >
            {isLoadingRestore ? "Restaurando..." : "R"}
          </strong>
        )}
      </td>
    </tr>
  );
};

export default ModuloItem;
