import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { IRol } from "../../interfaces/Rol";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { getModulesToRol } from "../../api/modulos";
import { createOrUpdateRol } from "../../api/roles";
import CheckBox from "../inputs/Checkbox";
import { CheckboxOption } from "../../interfaces/Checkbox";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  createPermisoRole,
  getPermisosByRol,
  getPermisosToRol,
} from "../../api/permisos";

interface IProps {
  show: boolean;
  handleClose: () => void;
  rol: IRol;
}

const RolEdit = (options: IProps) => {
  const queryClient = useQueryClient();
  const { show, handleClose, rol } = options;
  const [values, setValues] = useState<IRol>({
    name: rol.name,
    description: rol.description,
    module: [],
  });

  //all modulos
  const {
    isLoading: isLoadingModulos,
    error: errorModulos,
    data: dataModulos,
  } = useQuery({
    queryKey: ["modulos"],
    queryFn: async () => await getModulesToRol(),
  });

  //all permisos
  const {
    isLoading: isLoadingPermisosRol,
    error: errorPermisosRol,
    data: dataPermisosRol,
  } = useQuery({
    queryKey: ["permisos.rol", rol._id],
    queryFn: async () => await getPermisosToRol(String(rol._id)),
  });

  //permisos x rol
  const {
    isLoading: isLoadingPermisosXRol,
    error: errorPermisosXRol,
    data: dataPermisosXRol,
  } = useQuery({
    queryKey: ["permisos.rol1", rol._id],
    queryFn: async () => await getPermisosByRol(String(rol._id)),
  });

  const [moduloSelected, setModuloSelected] = useState<string[]>(
    rol.module.map((a: any) => a.value) || []
  );

  const [permisoSelected, setPermisoSelected] = useState<string[]>([]);

  const handleChange =
    (prop: keyof IRol) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  //mutate rol
  const { isLoading: isLoadingForm, mutate: mutateForm } = useMutation({
    mutationFn: (values: any) => createOrUpdateRol(values.body, values.id),
    onSuccess: () => queryClient.invalidateQueries(["roles"]),
  });

  //mutate permisos a rol
  const { isLoading: isLoadingRolPermi, mutate: mutateRolPermi } = useMutation({
    mutationFn: (values: any) => createPermisoRole(values),
    onSuccess: () => queryClient.invalidateQueries(["permisos.rol1"]),
  });

  const modulos = useMemo(() => {
    if (!dataModulos) return [];

    //.sort((a, b) => a.label.localeCompare(b.label))
    const redata = dataModulos;

    return redata;
  }, [dataModulos]);

  const permisos = useMemo(() => {
    if (!dataPermisosRol) return [];

    const resData = dataPermisosRol;

    return resData;
  }, [dataPermisosRol]);

  const handleCheckModules = (value: string[]) => setModuloSelected(value);
  const handleCheckPermisos = (value: string[]) => setPermisoSelected(value);

  const closeModal = () => {
    handleClose();
    setPermisoSelected([]);
    setModuloSelected([]);
  };

  const onSubmit = async () => {
    mutateForm(
      {
        body: {
          name: values.name,
          module: moduloSelected,
          description: values.description,
        },
        id: rol._id,
      },
      {
        onError(error: any) {
          const err = error.response.data;
          alert(err.message);
        },
      }
    );

    mutateRolPermi(
      {
        role: rol._id,
        resource: permisoSelected,
      },
      {
        onSuccess() {
          alert("Rol actualizado!!!");
          closeModal();
        },
        onError(error: any) {
          const err = error.response.data;
          alert(err.message);
        },
      }
    );
  };

  const loadPermisos = useCallback(() => {
    if (dataPermisosXRol) {
      setPermisoSelected(dataPermisosXRol);
    }
  }, [dataPermisosXRol]);

  useEffect(() => {
    loadPermisos();
  }, [loadPermisos]);

  return (
    <>
      <Modal className="" show={show} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar {rol.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="nameForm.ControlText">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                onChange={handleChange("name")}
                type="text"
                value={values.name}
                placeholder="Administrador"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="desForm.ControlText">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                onChange={handleChange("description")}
                type="text"
                value={values.description}
                placeholder="Aqui puedes colocar una descripcion"
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Modulos</Form.Label>
                  {isLoadingModulos ? (
                    errorModulos ? (
                      (errorModulos as Error).message
                    ) : (
                      "Cargando modulos..."
                    )
                  ) : (
                    <CheckBox
                      options={modulos as CheckboxOption[]}
                      value={moduloSelected}
                      handleChange={handleCheckModules}
                    />
                  )}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Permisos</Form.Label>
                  {isLoadingPermisosRol ? (
                    errorPermisosRol ? (
                      (errorPermisosRol as Error).message
                    ) : isLoadingPermisosXRol ? (
                      errorPermisosXRol ? (
                        (errorPermisosXRol as Error).message
                      ) : (
                        "Obteniendo permisos"
                      )
                    ) : (
                      "Cargando permisos..."
                    )
                  ) : (
                    <CheckBox
                      options={permisos as CheckboxOption[]}
                      value={permisoSelected}
                      handleChange={handleCheckPermisos}
                    />
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancelar
          </Button>
          <Button
            disabled={isLoadingForm || isLoadingRolPermi}
            variant="primary"
            onClick={onSubmit}
          >
            {isLoadingForm
              ? "Editando rol..."
              : isLoadingRolPermi
              ? "Editando Permisos..."
              : "OK"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RolEdit;
