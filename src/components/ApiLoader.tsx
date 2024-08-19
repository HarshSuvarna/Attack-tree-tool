import { RootState } from "../common/store";
import "../styles/loader.css";
import { Loader } from "./Loader";
import { useSelector } from "react-redux";

function ApiLoader() {
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  return (
    <div
      style={{ visibility: isLoading ? "visible" : "hidden" }}
      className="loader-bg"
    >
      <Loader />
    </div>
  );
}

export default ApiLoader;
