// RegistrationForm.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../common/store";
import { notifyError, notifyInfo } from "../components/customToast";
import { registerUser } from "../service/auth.service";
import { toggleLoading } from "../slice/loaderSlice";
import "../styles/registration.css";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const RegistrationForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const isAutheticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    console.log("herer");

    setVisible(!visible);
  };

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (isAutheticated) navigate("/dashboard");
  }, []);

  const validate = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName || formData.firstName.trim() === "") {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName || formData.lastName.trim() === "") {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        dispatch(toggleLoading(true));
        await registerUser(formData);
        notifyInfo("Please check your email for the verification url.");
        // notifySuccess("Registration Successful!");
        // localStorage.setItem("token", res.token);
        // const userData = res.userData;
        // dispatch(setUser(userData));
        dispatch(toggleLoading(false));
        navigate("/dashboard");
      } catch (error: any) {
        notifyError(error?.message || "Something went wrong");
        dispatch(toggleLoading(false));
      } finally {
        dispatch(toggleLoading(false));
      }

      // Handle form submission (e.g., send data to API)
    }
  };
  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <div className="key-value">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <span className="error">{errors.firstName}</span>
          )}
        </div>
        <div className="key-value">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>
        <div className="key-value">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="key-value">
          <label htmlFor="password">Password</label>
          <div className="container-input">
            <input
              type={visible ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <i
              onClick={togglePasswordVisibility}
              className={
                visible ? "fa-solid fa-eye-slash size" : "fa-solid fa-eye size left"
              }
            ></i>
          </div>
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <button className="register-btn " type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
