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
    navigate("/login");
  };
  return (
    <div>
      <button onClick={handleButtonClick}>Logout</button>
    </div>
  );
}
