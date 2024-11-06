import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShop } from "@fortawesome/free-solid-svg-icons";

const Stall = ({ occupied, number }) => {
  return (
    <div
      className={`${
        occupied ? "bg-sky-600/90" : "bg-white/90"
      } rounded-sm h-16 py-2 col-span-1 shadow-md`}
    >
      <div className="flex flex-col gap-y-2 items-center">
        <h1
          className={`${
            occupied ? "text-white" : "text-sky-600"
          } font-extrabold`}
        >
          {number}
        </h1>
        <FontAwesomeIcon icon={faShop} className="text-sky-800" />
      </div>
    </div>
  );
};

export default Stall;
