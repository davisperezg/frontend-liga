import Spinner from "../../utils/images/spinner.gif";
import "./index.css";

const FullPageLoader = () => {
  return (
    <div className="fp_container">
      <img src={Spinner} className="fp_loader" alt="loading" />
    </div>
  );
};

export default FullPageLoader;
