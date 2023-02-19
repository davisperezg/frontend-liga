import Content from "../components/Content";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function RootScreen() {
  return (
    <>
      <Header />
      <Content>
        <div
          style={{ display: "flex", width: "100%" }}
          className="max-w alinear"
        >
          <Outlet />
        </div>
      </Content>
      <Footer />
    </>
  );
}
