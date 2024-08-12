import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ApiLoader from "../components/ApiLoader";
import { login } from "../service/auth.service";
import { toggleLoading } from "../slice/loaderSlice";
import { setUser } from "../slice/userSlice";
import { RootState } from "../common/store";
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
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAutheticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };
  const onSubmit = async () => {
    try {
      const params: loginInterface = { email, password };
      dispatch(toggleLoading(true));
      const res = await login(params);
      const userData = res.userData;
      dispatch(setUser(userData));
      dispatch(toggleLoading(false));
      navigate("/home");
    } catch (error) {
      console.log("could not log in");
      dispatch(toggleLoading(false));
    } finally {
      dispatch(toggleLoading(false));
    }
  };

  useEffect(() => {
    if (isAutheticated) navigate("/home");
  }, []);
  return (
    <div className="login-container">
      <ApiLoader />

      <p>login</p>
      <input
        type="text"
        name="email"
        placeholder="email"
        onChange={handleEmailChange}
      />
      <input
        type="text"
        name="password"
        id=""
        placeholder="password"
        onChange={handlePasswordChange}
      />
      <button onClick={onSubmit}>Login</button>
      <button onClick={() => navigate("/register")}>Register</button>
    </div>
  );
}
