import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useQuery, useQueryClient, useMutation } from "react-query";
import CheckBox from "../inputs/Checkbox";
import { ChangeEvent, useState, useMemo } from "react";
import { getMenus } from "../../api/menu";
import { IModulo } from "../../interfaces/Modulo";
import { IMenu } from "../../interfaces/Menu";
import { CheckboxOption } from "../../interfaces/Checkbox";
import { createOrUpdateModule } from "../../api/modulos";

interface IProps {
  show: boolean;
  handleClose: () => void;
  modulo: IModulo;
}

const ModuloEdit = (options: IProps) => {
  const queryClient = useQueryClient();
  const { show, handleClose, modulo } = options;
  const {
    isLoading: isLoadingMenus,
    error: isErrorMenus,
    data: dataMenus,
  } = useQuery({
    queryKey: ["menus"],
    queryFn: async () => await getMenus(),
  });

  const [menuSelected, setMenuSelected] = useState<string[]>(
    (modulo.menu as IMenu[]).map((a) => a.name) || []
  );
  const [values, setValues] = useState<IModulo>({
    name: modulo.name,
    menu: [],
  });

  const handleChange =
    (prop: keyof IModulo) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

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

  const { isLoading: isLoadingForm, mutate: mutateForm } = useMutation({
    mutationFn: (value: any) => createOrUpdateModule(value.body, value.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["modulos.list"]);
    },
  });

  const handleCheckModules = (value: string[]) => setMenuSelected(value);

  const onSubmit = () => {
    mutateForm(
      {
        body: {
          name: values.name,
          menu: menuSelected,
        },
        id: modulo._id,
      },
      {
        onSuccess() {
          alert("Modulo actualizado");
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
          <Modal.Title>Editar {modulo.name}</Modal.Title>
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
            {isLoadingForm ? "Editando modulo..." : "OK"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModuloEdit;
