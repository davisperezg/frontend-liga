import { IRol } from "../../interfaces/Rol";
import { useMutation, useQueryClient } from "react-query";
import { deleteRole, restoreRole } from "../../api/roles";

interface IProps {
  rol: IRol;
  contador: number;
  handleShowEdit: (data: IRol) => void;
}

const RolItem = ({ rol, contador, handleShowEdit }: IProps) => {
  const queryClient = useQueryClient();
  const { isLoading: isLoadingDelete, mutate: mutateDelete } = useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"]);
    },
  });

  const { isLoading: isLoadingRestore, mutate: mutateRestore } = useMutation({
    mutationFn: (id: string) => restoreRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"]);
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
      <td>{rol.name}</td>
      <td>{rol.creator}</td>
      <td>{rol.createdAt?.toString()}</td>
      <td>{rol.updatedAt?.toString()}</td>
      <td>{rol.status ? "Habilitado" : "Eliminado"}</td>
      <td
        onClick={() => handleShowEdit(rol)}
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
        {rol.status ? (
          <strong
            onClick={() => desactivar(String(rol._id))}
            style={{ color: "red" }}
          >
            {isLoadingDelete ? "Eliminando" : "X"}
          </strong>
        ) : (
          <strong
            onClick={() => restaurar(String(rol._id))}
            style={{ color: "yellow" }}
          >
            {isLoadingRestore ? "Restaurando..." : "R"}
          </strong>
        )}
      </td>
    </tr>
  );
};

export default RolItem;
