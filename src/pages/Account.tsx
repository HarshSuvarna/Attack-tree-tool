import { useEffect, useState } from "react";
import "../styles/account.css";
import { updateUser } from "../service/user.service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../common/store";
import { notifyError, notifySuccess } from "../components/customToast";
import { setUser } from "../slice/userSlice";
function Account() {
  interface FormData {
    firstName: string;
    lastName: string;
    email: string;
  }
  const userData = useSelector((state: RootState) => state.user.userData || {});
  const dispatch = useDispatch();

  useEffect(() => {
    setFormData({
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      email: userData?.email,
    });
  }, []);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    console.log("formData :>> ", formData);
  }, [formData]);
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      await updateUser(userData._id, formData);
      dispatch(setUser({ ...userData, ...formData }));
      console.log("userData :>> ", userData);
      notifySuccess("User data updated");
    } catch (error) {
      notifyError("Cannot update user");
    }
  };

  return (
    <div className="register-container">
      <form>
        <div className="key-value">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
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
        </div>
        <div className="key-value">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            disabled={true}
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <button onClick={handleSubmit} className="register-btn ">
          Update
        </button>
      </form>
    </div>
  );
}

export default Account;
