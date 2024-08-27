import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
const Spinner = () => {
  return (
    <div className="flex items-center gap-x-2 text-sky-700 text-base">
      <div>Loading...</div>
      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
    </div>
  );
};

export default Spinner;
