import { BrowserRouter, Route, Routes } from "react-router-dom";
import "reactflow/dist/style.css";
import "./App.css";
import Login from "./auth/Login";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import TreeBuilder from "./pages/TreeBuilder";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import RegistrationForm from "./auth/Register";
import NodeInfoModal from "./components/NodeInfoModal";
import { useSelector } from "react-redux";
import { RootState } from "./common/store";

function App() {
  const protectRoute = (Route: JSX.Element) => {
    return <ProtectedRoute>{Route}</ProtectedRoute>;
  };
  const { isOpen } = useSelector((state: RootState) => state.modal);

  return (
    <div className="main-app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={protectRoute(<Home />)} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={protectRoute(<Home />)} />
          <Route
            path="/design/:treeId"
            element={protectRoute(<TreeBuilder />)}
          />
          <Route path="*" element={<NoPage />} />
        </Routes>
        {isOpen && <NodeInfoModal />}
      </BrowserRouter>
    </div>
  );
}

export default App;
