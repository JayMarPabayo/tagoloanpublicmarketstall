import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isAdministrator = false;
  let isStaff = false;
  let status = "Staff";

  if (token) {
    const decoded = jwtDecode(token);
    const { id, username, fullname, role } = decoded.UserInfo;

    isAdministrator = role === "Administrator";
    isStaff = role === "Staff";

    if (isAdministrator) status = "Administrator";

    return { id, username, fullname, role, status, isAdministrator, isStaff };
  }

  return {
    id: "",
    fullname: "",
    username: "",
    role: "",
    isAdministrator,
    isStaff,
    status,
  };
};
export default useAuth;
