import { useNavigate, useParams } from "react-router-dom";
import "../styles/verify.css";
import { verifyEmailUrl } from "../service/auth.service";
import { notifySuccess } from "../components/customToast";
import { useEffect, useState } from "react";

function VerifyEmail() {
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const { userId, token } = useParams();
  const verifyUser = async () => {
    try {
      await verifyEmailUrl({ userId, token });
      setVerified(true);
      //   notifySuccess("User Verified!");
    } catch (error: any) {
      notifySuccess("User not verified");
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);
  return (
    <div className="verify-email-container">
      {verified ? (
        <>
          <p>Your Email was verified. You can login using your credentials!</p>
          <button onClick={() => navigate("/login")} className="register-btn">
            Login
          </button>
        </>
      ) : !verified ? (
        <>
          <p>We are sorry. Your email could not be verified</p>
          <button onClick={() => navigate("/login")} className="register-btn">
            Login
          </button>
        </>
      ) : (
        <p>Please wait</p>
      )}
    </div>
  );
}

export default VerifyEmail;
