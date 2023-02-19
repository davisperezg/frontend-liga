import { IUsuario } from "../../interfaces/Usuario";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { createOrUpdateUser } from "../../api/usuarios";
import { getRoles } from "../../api/roles";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { createModulosUser, getModulesToRol } from "../../api/modulos";
import CheckBox from "../inputs/Checkbox";
import { CheckboxOption } from "../../interfaces/Checkbox";
import {
  createPermsisoUser,
  findModuloByUser,
  getPermisosByUser,
  getPermisosToRol,
} from "../../api/permisos";

interface IProps {
  show: boolean;
  handleClose: () => void;
  usuario: IUsuario;
}

const UsuarioEdit = (options: IProps) => {
  const queryClient = useQueryClient();
  const { show, handleClose, usuario } = options;
  const [values, setValues] = useState<IUsuario>({
    name: usuario.name,
    lastname: usuario.lastname,
    tipDocument: usuario.tipDocument,
    nroDocument: usuario.nroDocument,
    role: String(usuario.roleId),
    email: usuario.email,
    liga: usuario.liga,
  });

  const [moduloSelected, setModuloSelected] = useState<string[]>([]);
  const [permisoSelected, setPermisoSelected] = useState<string[]>([]);

  const handleCheckModules = (value: string[]) => setModuloSelected(value);
  const handleCheckPermisos = (value: string[]) => setPermisoSelected(value);

  //la misma lista de la lista roles
  const {
    isLoading: isLoadingRoles,
    error: errorRoles,
    data: dataRoles,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => await getRoles(),
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
    isLoading: isLoadingPermisos,
    error: errorPermisos,
    data: dataPermisos,
  } = useQuery({
    queryKey: ["permisos.rol", String(usuario.roleId)],
    queryFn: async () => await getPermisosToRol(String(usuario.roleId)),
  });

  //modulos x usuario
  const {
    isLoading: isLoadingModulosXUser,
    error: errorModulosXUser,
    data: dataModulosXUser,
  } = useQuery({
    queryKey: ["modulos.user1", usuario._id],
    queryFn: async () => await findModuloByUser(String(usuario._id)),
  });

  //permisos x usuario
  const {
    isLoading: isLoadingPermisosXUser,
    error: errorPermisosXUser,
    data: dataPermisosXUser,
  } = useQuery({
    queryKey: ["permisos.user1", usuario._id],
    queryFn: async () => await getPermisosByUser(String(usuario._id)),
  });

  const permisos = useMemo(() => {
    if (!dataPermisos) return [];

    const resData = dataPermisos;

    return resData;
  }, [dataPermisos]);

  const modulos = useMemo(() => {
    if (!dataModulos) return [];

    //.sort((a, b) => a.label.localeCompare(b.label))
    const redata = dataModulos;

    return redata;
  }, [dataModulos]);

  //mutate edit usuarios
  const { isLoading: isLoadingForm, mutate: mutateForm } = useMutation({
    mutationFn: (values: any) => createOrUpdateUser(values.body, values.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["usuarios"]);
    },
  });

  const { isLoading: isLoadingMUForm, mutate: mutateMUForm } = useMutation({
    mutationFn: (values: any) => createModulosUser(values.body),
    onSuccess: () => {
      queryClient.invalidateQueries(["modulos.user1"]);
    },
  });

  const { isLoading: isLoadingPUForm, mutate: mutatePUForm } = useMutation({
    mutationFn: (values: any) => createPermsisoUser(values.body),
    onSuccess: () => {
      queryClient.invalidateQueries(["permisos.user1"]);
    },
  });

  const roles = useMemo(() => {
    if (!dataRoles) return [];

    const redata = dataRoles;

    return redata;
  }, [dataRoles]);

  const closeModal = () => {
    handleClose();
    setPermisoSelected([]);
    setModuloSelected([]);
  };

  const onSubmit = () => {
    mutateForm(
      {
        body: values,
        id: usuario._id,
      },
      {
        onError(error: any) {
          const err = error.response.data;
          alert(err.message);
        },
      }
    );

    mutateMUForm(
      {
        body: {
          user: usuario._id,
          module: moduloSelected,
        },
      },
      {
        onError(error: any) {
          const err = error.response.data;
          alert(err.message);
        },
      }
    );

    mutatePUForm(
      {
        body: {
          user: usuario._id,
          resource: permisoSelected,
        },
      },

      {
        onSuccess() {
          alert("Usuario actualizado!!!");
          closeModal();
        },
        onError(error: any) {
          const err = error.response.data;
          alert(err.message);
        },
      }
    );
  };

  const handleChange =
    (prop: keyof IUsuario) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleChange2 =
    (prop: keyof IUsuario) => (event: ChangeEvent<HTMLSelectElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const loadPermisos = useCallback(() => {
    if (dataPermisosXUser) {
      setPermisoSelected(dataPermisosXUser);
    }
  }, [dataPermisosXUser]);

  const loadModulos = useCallback(() => {
    if (dataModulosXUser) {
      const formatoOption = dataModulosXUser.map((a: any) => a._id);
      setModuloSelected(formatoOption);
    }
  }, [dataModulosXUser]);

  useEffect(() => {
    loadPermisos();
    loadModulos();
  }, [loadPermisos, loadModulos]);

  return (
    <Modal className="" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          Editar {usuario.name + " " + usuario.lastname}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs
          defaultActiveKey="home"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="home" title="General">
            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Rol</Form.Label>
                {isLoadingRoles ? (
                  errorRoles ? (
                    (errorRoles as Error).message
                  ) : (
                    "Cargando roles"
                  )
                ) : (
                  <Form.Select
                    value={String(values.role)}
                    onChange={handleChange2("role")}
                    aria-label="select rol"
                    autoFocus
                  >
                    <option disabled={true} value="NULL">
                      [SELECCIONE ROL]
                    </option>
                    {roles
                      .filter((x) => x.name !== "OWNER")
                      .map((a) => {
                        return (
                          <option
                            disabled={a.status ? false : true}
                            value={a._id}
                          >
                            {a.name}
                          </option>
                        );
                      })}
                  </Form.Select>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="ligaForm.ControlText">
                <Form.Label>Liga</Form.Label>
                <Form.Select
                  value={values.liga}
                  onChange={handleChange2("liga")}
                  aria-label="select liga"
                >
                  <option value="SANTA MARIA">SANTA MARIA</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="tipDocForm.ControlText">
                <Form.Label>Tipo de documento</Form.Label>
                <Form.Select
                  value={values.tipDocument}
                  onChange={handleChange2("tipDocument")}
                  aria-label="select liga"
                >
                  <option value="DNI">DNI</option>
                  <option value="RUC">RUC</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="docForm.ControlText">
                <Form.Label>Nro de documento</Form.Label>
                <Form.Control
                  value={values.nroDocument}
                  onChange={handleChange("nroDocument")}
                  type="text"
                  placeholder="12345678"
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="docForm.ControlText">
                    <Form.Label>Nombres</Form.Label>
                    <Form.Control
                      value={values.name}
                      onChange={handleChange("name")}
                      type="text"
                      placeholder="Juanito"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="docForm.ControlText">
                    <Form.Label>Apellidos</Form.Label>
                    <Form.Control
                      value={values.lastname}
                      onChange={handleChange("lastname")}
                      type="text"
                      placeholder="Perez"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3" controlId="docForm.ControlText">
                <Form.Label>Email/usuario</Form.Label>
                <Form.Control
                  value={values.email}
                  onChange={handleChange("email")}
                  type="email"
                  placeholder="juanito@gmail.com"
                  autoComplete="new-email"
                />
              </Form.Group>
            </Form>
          </Tab>
          <Tab eventKey="modulos" title="Modulos">
            <Form.Group className="mb-3">
              <Form.Label>Modulos</Form.Label>
              {isLoadingModulos ? (
                errorModulos ? (
                  (errorModulos as Error).message
                ) : isLoadingModulosXUser ? (
                  "Ocurrio un error al obtener lo modulos del usuario"
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
          </Tab>
          <Tab eventKey="permisos" title="Permisos">
            <Form.Group className="mb-3">
              <Form.Label>Permisos</Form.Label>
              {isLoadingPermisos ? (
                errorPermisos ? (
                  (errorPermisos as Error).message
                ) : isLoadingPermisosXUser ? (
                  errorPermisosXUser ? (
                    (errorPermisosXUser as Error).message
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
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          disabled={
            isLoadingForm
              ? isLoadingMUForm
                ? isLoadingPUForm
                  ? true
                  : true
                : true
              : false
          }
          variant="primary"
          onClick={onSubmit}
        >
          {isLoadingForm
            ? "Creando usuario..."
            : isLoadingMUForm
            ? "Creando modulos..."
            : isLoadingPUForm
            ? "Creando permisos..."
            : "OK"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UsuarioEdit;
