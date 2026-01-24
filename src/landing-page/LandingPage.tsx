import { Navigate } from "react-router-dom";
import { routes } from "wasp/client/router";

export default function LandingPage() {
  return <Navigate to={routes.TestRoute.build()} replace />;
}
