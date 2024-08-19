import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../common/store";
import { notifyError, notifySuccess } from "../components/customToast";
import { login } from "../service/auth.service";
import { toggleLoading } from "../slice/loaderSlice";
import { setUser } from "../slice/userSlice";
import "../styles/login.css";
export interface loginInterface {
  email: string;
  password: string;
}

export interface RegisterInterface {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAutheticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const togglePasswordVisibility = () => {
    console.log("herer");

    setVisible(!visible);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };
  const onSubmit = async () => {
    try {
      const params: loginInterface = { email, password };
      dispatch(toggleLoading(true));
      const res: any = await login(params);
      notifySuccess("Login Successful!");
      const userData = res.userData;
      localStorage.setItem("token", res.token);
      dispatch(setUser(userData));
      dispatch(toggleLoading(false));
      navigate("/dashboard");
    } catch (error) {
      notifyError("Invalid Credentials");
      dispatch(toggleLoading(false));
    } finally {
      dispatch(toggleLoading(false));
    }
  };

  useEffect(() => {
    if (isAutheticated) navigate("/dashboard");
  }, []);
  return (
    <div className="login-parent">
      <div className="login-container">
        {/* <ApiLoader /> */}

        <p>Login</p>
        <div className="input-container">
          <input
            type="text"
            name="email"
            placeholder="email"
            onChange={handleEmailChange}
          />
        </div>
        <div className="input-container">
          <input
            type={visible ? "text" : "password"}
            name="password"
            id=""
            placeholder="password"
            onChange={handlePasswordChange}
          />
          <i
            onClick={togglePasswordVisibility}
            className={visible ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}
          ></i>
        </div>
        <button className="register-btn" onClick={onSubmit}>
          Login
        </button>
        <button
          style={{ background: "transparent", fontSize: "15px" }}
          className="register-btn"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}
