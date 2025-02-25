import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

const Logout = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken();
    localStorage.removeItem('query');
    navigate("/", { replace: true });
  };

  handleLogout();

  return <></>;
};

export default Logout;
