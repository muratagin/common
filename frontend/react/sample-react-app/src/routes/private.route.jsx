import useAppContext from "@libs/context";
import Loading from "@libs/loading";
import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { isAuthenticated } = useAppContext();
  const location = useLocation();
  if (isAuthenticated.result === false && isAuthenticated.progress === false) {
    const returnUrl =
      location.pathname !== "/"
        ? `/login?returnUrl=${encodeURIComponent(
            location.pathname + location.search
          )}`
        : "/login";

    return <Navigate to={returnUrl} replace={true} />;
  }

  if (isAuthenticated.progress === true) {
    return <Loading />;
  } else return children;
}
