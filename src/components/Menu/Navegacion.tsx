import { CSSProperties, useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { IMenu } from "../../interfaces/Menu";
import { IModulo } from "../../interfaces/Modulo";
import SubMenuItem from "./SubMenuItem";

interface IProps {
  modulo: IModulo;
}

const Navegacion = ({ modulo }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const siNoHaymenus = (modulo as any).menus?.length === 0;

  const container = useRef<HTMLLIElement>(null);

  // Allow for outside click
  useEffect(() => {
    function handleOutsideClick(event: any) {
      if (!container.current?.contains(event.target)) {
        if (!isOpen) {
          return;
        }
        setIsOpen(!isOpen);
      }
    }

    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [isOpen, container, setIsOpen]);

  return (
    <li
      ref={container}
      className={`navbar__item ${siNoHaymenus ? " " : "navbar__item--drop"}`}
    >
      {siNoHaymenus ? (
        <NavLink
          onClick={() => setIsOpen(!isOpen)}
          className={({ isActive }) =>
            ` navbar__link ${isActive ? "navbar__link--active" : undefined}`
          }
          to={modulo.link ? modulo.link : modulo.name.trim().toLowerCase()}
        >
          {modulo.name}
        </NavLink>
      ) : (
        <li
          className="navbar__item navbar__item--drop"
          onClick={() => setIsOpen(!isOpen)}
        >
          <a className="navbar__dropdown">{modulo.name}</a>
        </li>
      )}

      {(modulo as any).menus && (modulo as any).menus?.length > 0 && isOpen && (
        <ul className="navbar__submenu">
          {((modulo as any).menus as IMenu[]).map((a) => {
            return (
              <SubMenuItem
                key={a._id}
                menu={a}
                setIsOpen={setIsOpen}
                isOpen={isOpen}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
};

export default Navegacion;
