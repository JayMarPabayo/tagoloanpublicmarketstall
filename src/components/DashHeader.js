import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";

import { useSendLogoutMutation } from "../features/auth/authApiSlice";

import LogoutConfirmationModal from "../utils/LogoutConfirmationModal";

const DashHeader = () => {
  const navigate = useNavigate();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      console.log("logged out");
      navigate("/login");
    }
  }, [isSuccess, navigate]);

  if (isLoading) return <p>Loading...</p>;

  if (isError) return <p>Error: {error.data?.message}</p>;

  const onLogoutUserClicked = async () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLogoutModalOpen(false);
    await sendLogout();
  };
  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const logoutButton = (
    <button title="Logout" onClick={onLogoutUserClicked}>
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
