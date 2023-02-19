import ktechLogo from "../assets/logo_ktech_png.png";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";
import { apitTime } from "../api/auth";
import { useContext } from "react";
import { findServiceByUser } from "../api/access";
import { useQuery } from "react-query";
import { AuthContext } from "../context";
import Navegacion from "./Menu/Navegacion";
import { IModulo } from "../interfaces/Modulo";

const Header = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  // const {
  //   isLoading: isLoadingTime,
  //   error: isErrorTime,
  //   data: dataTime,
  // } = useQuery({
  //   queryKey: ["time"],
  //   queryFn: async () => await apitTime(),
  //   refetchInterval: 1000,
  //   refetchIntervalInBackground: false,
  // });

  const {
    isLoading: isLoadingServices,
    error: errorServices,
    data: dataServices,
  } = useQuery({
    queryKey: ["access", user._id],
    queryFn: () => findServiceByUser(user._id),
  });

  const goLogin = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header__navegacion max-w alinear">
        <div className="header__logo">
          <Link to="/">
            <img src={ktechLogo} alt="Kemay Technology" />
          </Link>
        </div>
        <nav className="header__navbar">
          <ul className="navbar__list">
            {/* TIME */}
            {/* <li className="navbar__item">
              <a className="navbar__link">
                {isLoadingTime
                  ? isErrorTime
                    ? "Error time: " + (isErrorTime as Error).message
                    : "Cargando..."
                  : dataTime}
              </a>
            </li> */}

            <li className="navbar__item">
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "navbar__link navbar__link--active"
                    : "navbar__link--unselect"
                }
                to="/"
              >
                Ir a principal
              </NavLink>
            </li>

            {/* <li className="navbar__item navbar__item--drop">
              <a className="navbar__dropdown">Tickets</a>
              <ul className="navbar__submenu">
                <li className="navbar__subitem">
                  <a className="navbar__sublink" href="#">
                    Generar venta
                  </a>
                </li>
                <li>
                  <a className="navbar__sublink" href="#">
                    Generar cortesia
                  </a>
                </li>
              </ul>
            </li> */}

            {isLoadingServices ? (
              errorServices ? (
                (errorServices as Error).message
              ) : (
                <li>
                  <a>Cargando modulos...</a>
                </li>
              )
            ) : (
              dataServices.map((a: IModulo) => {
                return a.status && <Navegacion key={a._id} modulo={a} />;
              })
            )}

            {/* CERRAR SESION */}
            <li className="navbar__item">
              <a
                className="navbar__link"
                style={{ cursor: "pointer" }}
                onClick={goLogin}
              >
                Cerrar sesion
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
