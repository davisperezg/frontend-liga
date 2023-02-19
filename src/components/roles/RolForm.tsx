import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { IRol } from "../../interfaces/Rol";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { ChangeEvent, useMemo, useState } from "react";
import { getModulesToRol } from "../../api/modulos";
import { createOrUpdateRol } from "../../api/roles";
import CheckBox from "../inputs/Checkbox";
import { CheckboxOption } from "../../interfaces/Checkbox";

interface IProps {
  show: boolean;
  handleClose: () => void;
  initialValue: IRol;
}

const RolForm = (options: IProps) => {
  const queryClient = useQueryClient();
  const { show, handleClose, initialValue } = options;
  const [values, setValues] = useState<IRol>(initialValue);
  const {
    isLoading: isLoadingModulos,
    error: errorModulos,
    data: dataModulos,
  } = useQuery({
    queryKey: ["modulos"],
    queryFn: async () => await getModulesToRol(),
  });
  const [moduloSelected, setModuloSelected] = useState<string[]>([]);

  const handleChange =
    (prop: keyof IRol) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const { isLoading: isLoadingForm, mutate: mutateForm } = useMutation({
    mutationFn: (values: IRol) => createOrUpdateRol(values),
    onSuccess: (data) => {
      const { role } = data;
      queryClient.setQueryData(["roles"], (prevModulos: any) =>
        prevModulos.concat(role)
      );
      queryClient.invalidateQueries(["roles"]);
    },
  });

  const modulos = useMemo(() => {
    if (!dataModulos) return [];

    const redata = dataModulos;

    return redata;
  }, [dataModulos]);

  const handleCheckModules = (value: string[]) => setModuloSelected(value);

  const onSubmit = () => {
    mutateForm(
      {
        name: values.name,
        module: moduloSelected,
        description: values.description,
      },
      {
        onSuccess() {
          alert("Rol creado!!!");
          handleClose();
        },
        onError(error: any) {
          const err = error.response.data;
          alert(err.message);
        },
      }
    );
  };

  return (
    <>
      <Modal className="" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear rol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="nameForm.ControlText">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                onChange={handleChange("name")}
                type="text"
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
                placeholder="Aqui puedes colocar una descripcion"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Modulos</Form.Label>
              {isLoadingModulos ? (
                errorModulos ? (
                  (errorModulos as Error).message
                ) : (
                  "Cargando modulos..."
                )
              ) : (
                <div className="modal__check">
                  <CheckBox
                    options={modulos as CheckboxOption[]}
                    value={moduloSelected}
                    handleChange={handleCheckModules}
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button disabled={isLoadingForm} variant="primary" onClick={onSubmit}>
            {isLoadingForm ? "Creando rol..." : "OK"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RolForm;
