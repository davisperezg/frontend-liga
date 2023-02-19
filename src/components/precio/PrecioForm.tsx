import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { IPrecio } from "../../interfaces/Precio";
import { ChangeEvent, useState } from "react";
import { createOrUpdatePrecio } from "../../api/precios";
import { useMutation, useQueryClient } from "react-query";

interface IProps {
  show: boolean;
  handleClose: () => void;
  initialValue: IPrecio;
}

const PrecioForm = (options: IProps) => {
  const queryClient = useQueryClient();
  const { show, handleClose, initialValue } = options;
  const [values, setValues] = useState<IPrecio>(initialValue);
  const handleChange2 =
    (prop: keyof IPrecio) => (event: ChangeEvent<HTMLSelectElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const { isLoading: isLoadingForm, mutate: mutateForm } = useMutation({
    mutationFn: (values: IPrecio) => createOrUpdatePrecio(values),
    onSuccess: (data) => {
      const { seq } = data;
      queryClient.setQueryData(["precios"], (prevModulos: any) => {
        return prevModulos.response.concat(seq);
      });
      queryClient.invalidateQueries(["precios"]);
    },
  });

  const handleChange =
    (prop: keyof IPrecio) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const onSubmit = () => {
    mutateForm(values, {
      onSuccess() {
        alert("Precio creado!!!");
        handleClose();
      },
      onError(error: any) {
        const err = error.response.data;
        alert(err.message);
      },
    });
  };

  return (
    <>
      <Modal className="" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear precio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Seleccionar liga</Form.Label>
              <Form.Select
                value={String(values.liga)}
                onChange={handleChange2("liga")}
                aria-label="select liga"
                autoFocus
              >
                <option disabled={true} value="NULL">
                  [SELECCIONE LIGA]
                </option>
                <option value="SANTA MARIA">SANTA MARIA</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="usuarioForm.ControlText">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                value={values.usuario}
                onChange={handleChange("usuario")}
                type="text"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="precioForm.ControlText">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                value={values.costo}
                onChange={handleChange("costo")}
                type="number"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button disabled={isLoadingForm} variant="primary" onClick={onSubmit}>
            {isLoadingForm ? "Creado precios..." : "OK"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PrecioForm;
