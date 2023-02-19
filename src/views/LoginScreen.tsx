import "../styles/login.css";
import ktechLogo from "../assets/logo_ktech_png.png";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { postLogin, whois } from "../api/auth";
import { AuthContext } from "../context";
import { BASE_API } from "../utils/const";

interface State {
  email: string;
  password: string;
}

const initialValue: State = {
  email: "",
  password: "",
};

interface IError {
  message: string;
  status: number;
  type: string;
}

const initialError: IError = {
  message: "",
  status: 0,
  type: "",
};

const LoginScreen = () => {
  const [values, setValues] = useState<State>(initialValue);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<IError>(initialError);
  const { setUser } = useContext(AuthContext);

  const handleChange =
    (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { email, password } = values;
      const { data } = await postLogin(email, password);
      if (data) {
        setError(initialError);
        const { user } = data;
        const { access_token, refresh_token } = user;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        const { data: dataUser } = await whois();
        const { user: myData } = dataUser;
        setUser(myData);
        localStorage.setItem("user", JSON.stringify(dataUser));
        setLoading(false);
      }
    } catch (e: any) {
      setError(e.response.data);
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login__form">
        <div className="login__logo">
          <Link to="/">
            <img src={ktechLogo} alt="Kemay Technology" height={100} />
          </Link>
        </div>
        <div className="login__header">
          <h1>Iniciar sesion</h1>
        </div>
        <div className="login__body">
          {error.message && <div className="error">{error.message}</div>}
          <form onSubmit={onSubmit}>
            <div className="content">
              <div className="content__item">
                <input
                  onChange={handleChange("email")}
                  className="content__input"
                  type="email"
                  placeholder="micorreo@dominio.com"
                />
              </div>

              <div className="content__item">
                <input
                  onChange={handleChange("password")}
                  className="content__input"
                  type="password"
                  placeholder="********"
                />
              </div>
            </div>

            <div className="btnn">
              <Button
                type="submit"
                size="lg"
                className="btn__submit"
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? "Ingresando..." : "Ingresar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
