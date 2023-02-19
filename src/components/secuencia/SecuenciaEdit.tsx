import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { ChangeEvent, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { ISecuencia } from "../../interfaces/Secuencia";
import { createOrUpdateSecuencia } from "../../api/secuencia";

interface IProps {
  show: boolean;
  handleClose: () => void;
  secuencia: ISecuencia;
}

const SecuenciaEdit = (options: IProps) => {
  const queryClient = useQueryClient();
  const { show, handleClose, secuencia } = options;
  const [values, setValues] = useState<ISecuencia>({
    liga: secuencia.liga,
    secuencia: secuencia.secuencia,
  });

  const handleChange =
    (prop: keyof ISecuencia) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleChange2 =
    (prop: keyof ISecuencia) => (event: ChangeEvent<HTMLSelectElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const { isLoading: isLoadingForm, mutate: mutateForm } = useMutation({
    mutationFn: (values: any) =>
      createOrUpdateSecuencia(values.body, values.id),
    onSuccess: (data) => queryClient.invalidateQueries(["secuencias"]),
  });

  const onSubmit = () => {
    mutateForm(
      {
        body: values,
        id: secuencia._id,
      },
      {
        onSuccess() {
          alert("Secuencia actualizada!!!");
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
    <Modal className="" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar {secuencia.liga}</Modal.Title>
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
            <Form.Label>Secuencia</Form.Label>
            <Form.Control
              value={values.secuencia}
              onChange={handleChange("secuencia")}
              type="text"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button disabled={isLoadingForm} variant="primary" onClick={onSubmit}>
          {isLoadingForm ? "Creando secuencia" : "OK"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SecuenciaEdit;
