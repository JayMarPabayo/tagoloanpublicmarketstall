import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
const FullScreenLoading = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-blur-md bg-gray-800 bg-opacity-20 flex justify-center items-center z-50">
      <FontAwesomeIcon
        icon={faSpinner}
        className="animate-spin text-white text-5xl"
      />
    </div>
  );
};

export default FullScreenLoading;
