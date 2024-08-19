import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleLoading } from "../slice/loaderSlice";
import { clearUser } from "../slice/userSlice";

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleButtonClick = () => {
    dispatch(clearUser());
    dispatch(toggleLoading(false));
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div>
      <button className="logout-btn" onClick={handleButtonClick}>
        Logout
      </button>
    </div>
  );
}
