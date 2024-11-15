import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const DashFooter = () => {
  const { fullname, status } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onGoHomeClicked = () => navigate("/dashboard");

  let goHomeButton = null;

  if (pathname !== "/dashboard") {
    goHomeButton = (
      <button title="Home" onClick={onGoHomeClicked}>
        <FontAwesomeIcon icon={faHouse} />
      </button>
    );
  }

  const date = new Date();
  const today = new Intl.DateTimeFormat("en-PH", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  const content = (
    <footer className="font-medium text-xs md:text-sm py-2 md:py-0 border-t border-sky-700 px-3 h-20 md:h-10 flex gap-x-10 items-center w-full">
      {goHomeButton}
      <p className="font-light flex flex-col md:block">
        <span className="font-extrabold">Current User:</span> {fullname}
      </p>
      <p className="font-light flex flex-col md:block self-start md:self-center">
        <span className="font-extrabold">Role:</span> {status}
      </p>
      <p className="ms-auto self-start md:self-center">{today}</p>
    </footer>
  );
  return content;
};

export default DashFooter;
