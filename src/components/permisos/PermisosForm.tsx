import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { IPermisos } from "../../interfaces/Permisos";
import { useQueryClient, useMutation } from "react-query";
import { ChangeEvent, useState } from "react";
import { createOrUpdatePermiso } from "../../api/permisos";

interface IProps {
  show: boolean;
  handleClose: () => void;
  initialValue: IPermisos;
}

const PermisosForm = (options: IProps) => {
  const queryClient = useQueryClient();
  const { show, handleClose, initialValue } = options;
  const [values, setValues] = useState<IPermisos>(initialValue);

  const handleChange =
    (prop: keyof IPermisos) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const { isLoading: isLoadingForm, mutate: mutateForm } = useMutation({
    mutationFn: (values: IPermisos) => createOrUpdatePermiso(values),
    onSuccess: (data) => {
      const { created } = data;
      queryClient.setQueryData(["permisos"], (prevModulos: any) =>
        prevModulos.concat(created)
      );
      queryClient.invalidateQueries(["permisos"]);
    },
  });

  const onSubmit = () => {
    mutateForm(
      {
        name: values.name,
        key: values.key,
        description: values.key,
      },
      {
        onSuccess() {
          alert("Permiso creado!!!");
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
          <Modal.Title>Crear permiso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="nameForm.ControlText">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                onChange={handleChange("name")}
                type="text"
                placeholder="Crear usuario"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="keyForm.ControlText">
              <Form.Label>Key</Form.Label>
              <Form.Control
                onChange={handleChange("key")}
                type="text"
                placeholder="canCreate_User"
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button disabled={isLoadingForm} variant="primary" onClick={onSubmit}>
            {isLoadingForm ? "Creando permiso..." : "OK"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PermisosForm;
