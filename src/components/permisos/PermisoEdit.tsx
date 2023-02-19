import { ChangeEvent, useState } from "react";
import { IPermisos } from "../../interfaces/Permisos";
import { useQueryClient, useMutation } from "react-query";
import { createOrUpdatePermiso } from "../../api/permisos";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

interface IProps {
  show: boolean;
  handleClose: () => void;
  permiso: IPermisos;
}

const PermisoEdit = (options: IProps) => {
  const queryClient = useQueryClient();
  const { show, handleClose, permiso } = options;
  const [values, setValues] = useState<IPermisos>({
    name: permiso.name,
    key: permiso.key,
    description: permiso.description,
  });

  const handleChange =
    (prop: keyof IPermisos) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const { isLoading: isLoadingForm, mutate: mutateForm } = useMutation({
    mutationFn: (value: any) => createOrUpdatePermiso(value.body, value.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["permisos"]);
    },
  });

  const onSubmit = () => {
    mutateForm(
      {
        body: {
          name: values.name,
          key: values.key,
          description: values.description,
        },
        id: permiso._id,
      },
      {
        onSuccess() {
          alert("Permiso actualizado!!!");
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
          <Modal.Title>Editar {permiso.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                onChange={handleChange("name")}
                type="text"
                value={values.name}
                placeholder="Crear usuario"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="keyForm.ControlText">
              <Form.Label>Key</Form.Label>
              <Form.Control
                onChange={handleChange("key")}
                type="text"
                value={values.key}
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
                value={values.description}
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
            {isLoadingForm ? "Editando modulo..." : "OK"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PermisoEdit;
