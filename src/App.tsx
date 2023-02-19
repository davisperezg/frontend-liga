import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { AuthContext } from "./context";
import { AppRouter } from "./routes/AppRouter";

const initialValue = {
  _id: "",
  name: "",
  lastname: "",
  fullname: "",
  email: "",
  status: true,
  role: "",
  liga: "",
};

function App() {
  const [user, setUser] = useState(initialValue);

  useEffect(() => {
    const initialValue = JSON.parse(String(localStorage.getItem("user")));
    setUser(initialValue?.user);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <AppRouter />
    </AuthContext.Provider>
  );
}

export default App;
