import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { IUsuario } from "../../interfaces/Usuario";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { ChangeEvent, useMemo, useState } from "react";
import { createOrUpdateUser } from "../../api/usuarios";
import { getRoles } from "../../api/roles";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

interface IProps {
  show: boolean;
  handleClose: () => void;
  initialValue: IUsuario;
}

const UsuarioForm = (options: IProps) => {
  const queryClient = useQueryClient();
  const { show, handleClose, initialValue } = options;
  const [values, setValues] = useState<IUsuario>(initialValue);
  const {
    isLoading: isLoadingRoles,
    error: errorRoles,
    data: dataRoles,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => await getRoles(),
  });

  const { isLoading: isLoadingForm, mutate: mutateForm } = useMutation({
    mutationFn: (values: IUsuario) => createOrUpdateUser(values),
    onSuccess: (data) => {
      const { user } = data;
      queryClient.setQueryData(["usuarios"], (prevModulos: any) =>
        prevModulos.concat(user)
      );
      queryClient.invalidateQueries(["usuarios"]);
    },
  });

  const roles = useMemo(() => {
    if (!dataRoles) return [];

    const redata = dataRoles;

    return redata;
  }, [dataRoles]);

  const onSubmit = () => {
    mutateForm(values, {
      onSuccess() {
        alert("Usuario creado!!!");
        handleClose();
      },
      onError(error: any) {
        const err = error.response.data;
        alert(err.message);
      },
    });
  };

  const handleChange =
    (prop: keyof IUsuario) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleChange2 =
    (prop: keyof IUsuario) => (event: ChangeEvent<HTMLSelectElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  return (
    <>
      <Modal className="" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                <Form.Group className="mb-3" controlId="nameForm.ControlText">
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
                <Form.Group
                  className="mb-3"
                  controlId="lastnameForm.ControlText"
                >
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
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="emailForm.ControlText">
                  <Form.Label>Email/usuario</Form.Label>
                  <Form.Control
                    value={values.email}
                    onChange={handleChange("email")}
                    type="email"
                    placeholder="juanito@gmail.com"
                    autoComplete="new-email"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="passForm.ControlText">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    value={values.password}
                    onChange={handleChange("password")}
                    type="password"
                    placeholder="*********"
                    autoComplete="new-password"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            {isLoadingForm ? "Creando usuarios..." : "OK"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UsuarioForm;
