import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "reactflow/dist/style.css";
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

function App() {
  // const location = useLocation();
  // const shouldShowNavbar = location.pathname !== "/login";
  const protectRoute = (Route: JSX.Element) => {
    return <ProtectedRoute>{Route}</ProtectedRoute>;
  };
  const { isOpen } = useSelector((state: RootState) => state.modal);

  return (
    <div className="main-app">
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
