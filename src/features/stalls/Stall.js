import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShop } from "@fortawesome/free-solid-svg-icons";

const Stall = ({ occupied, number, reserved = false }) => {
  return (
    <div
      className={`${
        occupied ? "bg-rose-600/80" : "bg-white/90"
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
        {reserved ? (
          <p className="text-white font-medium">Reserved</p>
        ) : (
          <FontAwesomeIcon
            icon={faShop}
            className={`${occupied ? "text-rose-900" : "text-sky-600"}`}
          />
        )}
      </div>
    </div>
  );
};

export default Stall;
