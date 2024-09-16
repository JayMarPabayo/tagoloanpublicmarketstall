import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isAdministrator = false;
  let status = "Staff";

  if (token) {
    const decoded = jwtDecode(token);
    const { id, username, fullname, role } = decoded.UserInfo;

    isAdministrator = role === "Administrator";

    if (isAdministrator) status = "Administrator";

    return { id, username, fullname, role, status, isAdministrator };
  }

  return {
    id: "",
    fullname: "",
    username: "",
    role: "",
    isAdministrator,
    status,
  };
};
export default useAuth;
