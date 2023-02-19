import { useCallback, useEffect, useMemo, useState } from "react";

interface CheckboxOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
  forbidden?: boolean;
}

interface Props {
  options: string[] | CheckboxOption[];
  value: string[] | CheckboxOption[];
  handleChange: (value: string[]) => void;
}

const CheckBox = ({ options, value, handleChange }: Props) => {
  const [values, setValues] = useState<string[]>([]);

  const itemsFiltered = useMemo(() => {
    return options;
  }, [options]);

  const handleChangeCheck = (e: any) => {
    //buscar repetidos
    const findRepeat = values.find((mod) => mod === e.target.name);
    //si encuentra repetido
    if (findRepeat) {
      //filtra y lo quita del array
      const kickModule = values.filter((mod) => mod !== findRepeat);
      setValues(kickModule);
      handleChange(kickModule);
      return;
    }
    //si no encuentra, lo agrega
    setValues([...values, e.target.name]);
    handleChange([...values, e.target.name]);
  };

  const loadValues = useCallback(() => {
    const values: any[] = value.map((format) =>
      typeof format === "string" ? format : format.value
    );
    setValues(values);
  }, [value]);

  //carga los valores
  useEffect(() => {
    loadValues();
  }, [loadValues]);

  return (
    <>
      {itemsFiltered.map((item: any, i) => {
        return (
          <label
            style={{ width: "100%" }}
            key={typeof item === "string" ? i + item.toLowerCase() : item.value}
          >
            <input
              disabled={typeof item === "string" ? false : item.disabled}
              type="checkbox"
              onChange={handleChangeCheck}
              name={typeof item === "string" ? item.toLowerCase() : item.value}
              checked={
                typeof item === "string"
                  ? values.some((value) => value === item.toLowerCase())
                  : values.some((value) => value === item.value)
              }
            />
            {typeof item === "string"
              ? item
              : item.label +
                `${
                  item.forbidden === false
                    ? " - ITEM_ANULADO"
                    : item.forbidden === true
                    ? ""
                    : ""
                }`}
          </label>
        );
      })}
    </>
  );
};

export default CheckBox;
