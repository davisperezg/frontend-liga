import { IUsuario } from "../../interfaces/Usuario";
import { useMutation, useQueryClient } from "react-query";
import { deleteUser, restoreUser } from "../../api/usuarios";

interface IProps {
  usuario: IUsuario;
  contador: number;
  handleShowEdit: (data: IUsuario) => void;
}

const UsuarioItem = ({ usuario, contador, handleShowEdit }: IProps) => {
  const queryClient = useQueryClient();

  const { isLoading: isLoadingDelete, mutate: mutateDelete } = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["usuarios"]);
    },
  });

  const { isLoading: isLoadingRestore, mutate: mutateRestore } = useMutation({
    mutationFn: (id: string) => restoreUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["usuarios"]);
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
      <td>{usuario.name + " " + usuario.lastname}</td>
      <td>{usuario.role.toString()}</td>
      <td>{usuario.tipDocument}</td>
      <td>{usuario.nroDocument}</td>
      <td>{usuario.email}</td>
      <td>{usuario.liga}</td>
      <td>{usuario.status ? "Habilitado" : "Eliminado"}</td>
      <td
        onClick={() => handleShowEdit(usuario)}
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
        {usuario.status ? (
          <strong
            onClick={() => desactivar(String(usuario._id))}
            style={{ color: "red" }}
          >
            {isLoadingDelete ? "Eliminando" : "X"}
          </strong>
        ) : (
          <strong
            onClick={() => restaurar(String(usuario._id))}
            style={{ color: "yellow" }}
          >
            {isLoadingRestore ? "Restaurando..." : "R"}
          </strong>
        )}
      </td>
    </tr>
  );
};

export default UsuarioItem;
