import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Unauthorized from "../pages/Unauthorized";

export default function AdminRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Unauthorized />;
  }

  return children;
}