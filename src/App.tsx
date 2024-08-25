import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "@xyflow/react/dist/style.css";

import "./App.css";
import Login from "./auth/Login";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import RegistrationForm from "./auth/Register";
import { RootState } from "./common/store";
import Navbar from "./components/Navbar";
import NodeInfoModal from "./components/NodeInfoModal";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import TreeBuilder from "./pages/TreeBuilder";
import { ToastContainer } from "react-toastify";
import LandingPage from "./pages/LandingPage";
import Account from "./pages/Account";
import VerifyEmail from "./pages/VerifyEmail";
// import { useEffect, useState } from "react";

function App() {
  // const location = useLocation();
  // const shouldShowNavbar = location.pathname !== "/login";
  const protectRoute = (Route: JSX.Element) => {
    return <ProtectedRoute>{Route}</ProtectedRoute>;
  };
  const { isOpen } = useSelector((state: RootState) => state.modal);

  // const [screenSize, setScreenSize] = useState<any>({
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // });

  // useEffect(() => {
  //   // Function to update screen size
  //   const handleResize = () => {
  //     setScreenSize({
  //       width: window.innerWidth,
  //       height: window.innerHeight,
  //     });
  //   };

  //   // Add event listener to track window resize
  //   window.addEventListener("resize", handleResize);

  //   // Clean up the event listener when the component unmounts
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  return (
    <div className="main-app">
      {/* <p>{screenSize}</p> */}
      <ToastContainer position="top-right" />
      <BrowserRouter>
        {<Navbar />}
        <Routes>
          <Route path="/" element={protectRoute(<Home />)} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={protectRoute(<Home />)} />
          <Route
            path="/design/:treeId"
            element={protectRoute(<TreeBuilder />)}
          />
          <Route path="/home" element={<LandingPage />} />
          <Route path="*" element={<NoPage />} />
          <Route path="/account" element={protectRoute(<Account />)} />
          <Route
            path="/verify-email/:userId/:token"
            element={<VerifyEmail />}
          />
        </Routes>
        {isOpen && <NodeInfoModal />}
      </BrowserRouter>
    </div>
  );
}

export default App;
