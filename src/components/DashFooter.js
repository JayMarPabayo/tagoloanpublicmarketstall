import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

const DashFooter = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onGoHomeClicked = () => navigate("/dash");

  let goHomeButton = null;

  if (pathname !== "/dash") {
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
    <footer className="font-medium text-sm border-t border-sky-700 px-3 h-10 absolute bottom-0 flex gap-x-10 items-center w-full">
      {goHomeButton}
      <p>Current User:</p>
      <p>Status:</p>
      <p className="ms-auto">{today}</p>
    </footer>
  );
  return content;
};

export default DashFooter;
