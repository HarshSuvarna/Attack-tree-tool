import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logout from "../auth/Logout";
import { RootState } from "../common/store";
import "../styles/navbar.css";
import { attackTreeLink } from "../common/helper";
function Navbar() {
  const isAutheticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isAutheticated) {
      navigate("/dashboard");
    }
  };
  return (
    <div className="navbar-container">
      <div>ATTACK TREE TOOL</div>
      <div className="links">
        <p onClick={() => window.open(attackTreeLink, "_blank", "noreferrer")}>
          What is an Attack Tree?
        </p>
      </div>
      <div className="links">
        <p onClick={() => navigate("/home")}>Home</p>
        {!isAutheticated && (
          <p onClick={() => navigate("/register")}>Register</p>
        )}
        <p onClick={() => navigate("/dashboard")}>Dashboard</p>
        {isAutheticated && <p onClick={() => navigate("/account")}>Account</p>}
        <p onClick={handleClick}>{isAutheticated ? <Logout /> : "Login"}</p>
      </div>
      {/* <div></div> */}
    </div>
  );
}

export default Navbar;
