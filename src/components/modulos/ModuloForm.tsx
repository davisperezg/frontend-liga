import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { getMenus } from "../../api/menu";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { createOrUpdateModule } from "../../api/modulos";
import { ChangeEvent, useState, useMemo } from "react";
import { IModulo } from "../../interfaces/Modulo";
import { CheckboxOption } from "../../interfaces/Checkbox";
import CheckBox from "../inputs/Checkbox";

interface IProps {
  show: boolean;
  handleClose: () => void;
  initialValue: IModulo;
}

const ModuloForm = (options: IProps) => {
  const queryClient = useQueryClient();
  const { show, handleClose, initialValue } = options;
  const [values, setValues] = useState<IModulo>(initialValue);
  const {
    isLoading: isLoadingMenus,
    error: isErrorMenus,
    data: dataMenus,
  } = useQuery({
    queryKey: ["menus"],
    queryFn: async () => await getMenus(),
  });
  const [menuSelected, setMenuSelected] = useState<string[]>([]);

  const handleChange =
    (prop: keyof IModulo) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const { isLoading: isLoadingForm, mutate: mutateForm } = useMutation({
    mutationFn: (values: IModulo) => createOrUpdateModule(values),
    onSuccess: (data) => {
      const { module } = data;
      queryClient.setQueryData(["modulos.list"], (prevModulos: any) =>
        prevModulos.concat(module)
      );
      queryClient.invalidateQueries(["modulos.list"]);
    },
  });

  const menus = useMemo(() => {
    if (!dataMenus) return [];

    const redata = dataMenus
      .map((a) => {
        return {
          label: a.name,
          value: a.name,
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));

    return redata;
  }, [dataMenus]);

  const handleCheckModules = (value: string[]) => setMenuSelected(value);

  const onSubmit = () => {
    mutateForm(
      {
        name: values.name,
        menu: menuSelected,
      },
      {
        onSuccess() {
          alert("Modulo creado!!!");
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
          <Modal.Title>Crear modulo</Modal.Title>
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
                placeholder="Punto de venta"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Menus</Form.Label>
              {isLoadingMenus ? (
                isErrorMenus ? (
                  (isErrorMenus as Error).message
                ) : (
                  "Cargando menus..."
                )
              ) : (
                <div className="modal__check">
                  <CheckBox
                    options={menus as CheckboxOption[]}
                    value={menuSelected}
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
            {isLoadingForm ? "Creando modulo..." : "OK"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModuloForm;
