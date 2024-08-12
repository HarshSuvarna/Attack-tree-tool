import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../common/store";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  if (!isAuthenticated) {
    // if user is not authenticated, re-direct to login
    return <Navigate to="/login" />;
  }
  return children; // return the right page if user is authenticated
};
