import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants/routes";
import { ROLE_PREFIX } from "../constants/roles";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, roles } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAnyRole = roles.some((r) =>
      allowedRoles.some(
        (allowed) =>
          r === allowed ||
          r === `${ROLE_PREFIX}${allowed}` ||
          r.endsWith(allowed)
      )
    );

    if (!hasAnyRole) {
      return <div>Access Denied</div>;
    }
  }
  return children;
}
