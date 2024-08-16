import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logout from "../auth/Logout";
import { RootState } from "../common/store";
import "../styles/navbar.css";

function Navbar() {
  const isAutheticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isAutheticated) {
      navigate("/home");
    }
  };
  return (
    <div className="navbar-container">
      <div>ATTACK TREE TOOL</div>
      <div className="links">
        <p>About</p>
        <p>Contact Us</p>
        <p>What is an Attack Tree?</p>
      </div>
      <div className="links">
        {!isAutheticated && (
          <p onClick={() => navigate("/register")}>Register</p>
        )}
        <p>Account</p>
        <p onClick={handleClick}>{isAutheticated ? <Logout /> : "Login"}</p>
      </div>
      {/* <div></div> */}
    </div>
  );
}

export default Navbar;
