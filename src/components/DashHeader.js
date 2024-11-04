import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { useSendLogoutMutation } from "../features/auth/authApiSlice";

import LogoutConfirmationModal from "../utils/LogoutConfirmationModal";

const DashHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sectionGroup = location.state?.selectedSectionGroup || "";
  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const getParentPath = () => {
    const pathArray = location.pathname.split("/");

    const secondLastSegment = pathArray[pathArray.length - 2];

    if (pathArray.includes("vendors") && pathArray.includes("lease")) {
      return "/dashboard/vendors";
    }

    if (secondLastSegment === "view") {
      return "/dashboard/renting";
    }

    if (secondLastSegment === "stalls") {
      return "/dashboard/sections";
    }

    pathArray.pop();
    return pathArray.join("/") || "/dashboard";
  };

  useEffect(() => {
    if (isSuccess) {
      console.log("logged out");
      navigate("/login");
    }
  }, [isSuccess, navigate, location]);

  if (isLoading) return <p>Loading...</p>;

  if (isError) return <p>Error: {error.data?.message}</p>;

  const onLogoutUserClicked = () => {
    if (location.pathname === "/dashboard") {
      setIsLogoutModalOpen(true);
    } else {
      navigate(getParentPath(), {
        state: { selectedSectionGroup: sectionGroup },
      });
    }
  };

  const handleLogoutConfirm = async () => {
    setIsLogoutModalOpen(false);
    await sendLogout();
  };
  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const logoutButton = (
    <button
      title={location.pathname === "/dashboard" ? "Logout" : "Back"}
      onClick={onLogoutUserClicked}
    >
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  const content = (
    <header className="font-medium text-lg text-sky-800 border-b border-sky-700 p-3 mb-8 flex items-center justify-between">
      <Link to="/dashboard">
        Tagoloan Public Market Stall Fee Management System
      </Link>
      {logoutButton}
      {isLogoutModalOpen && (
        <LogoutConfirmationModal
          onConfirm={handleLogoutConfirm}
          onCancel={handleLogoutCancel}
        />
      )}
    </header>
  );

  return content;
};

export default DashHeader;
