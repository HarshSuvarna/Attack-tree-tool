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
      <p className="loader-text">
        It may take up to 50 seconds to load due to free-tier hosting
        limitations. Thank you for your patience.
      </p>
    </div>
  );
}

export default ApiLoader;
