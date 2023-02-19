import { IMenu } from "../../interfaces/Menu";
import { NavLink } from "react-router-dom";
import { useEffect, useRef } from "react";

interface IProps {
  menu: IMenu;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SubMenuItem = ({ menu, isOpen, setIsOpen }: IProps) => {
  return (
    <li className="navbar__subitem">
      <NavLink
        onClick={() => setIsOpen(!isOpen)}
        className="navbar__sublink"
        to={`/${menu.link}`}
      >
        {menu.name}
      </NavLink>
    </li>
  );
};

export default SubMenuItem;
