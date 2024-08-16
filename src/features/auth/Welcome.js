import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faUsers,
  faPersonShelter,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";

const Welcome = () => {
  const content = (
    <section className="px-3 flex flex-col gap-y-2">
      <Link
        to="/dash/stalls"
        className="flex items-center gap-x-4 text-white bg-sky-900 rounded-sm px-3 py-2 w-60 text-sm hover:bg-sky-800 hover:w-64 duration-300"
      >
        <FontAwesomeIcon className="w-[15px]" icon={faStore} />
        <p>View Stalls</p>
      </Link>

      <Link
        to="/dash/users"
        className="flex items-center gap-x-4 text-white bg-sky-900 rounded-sm px-3 py-2 w-60 text-sm hover:bg-sky-800 hover:w-64 duration-300"
      >
        <FontAwesomeIcon className="w-[15px]" icon={faPersonShelter} />
        <p>View Vendors</p>
      </Link>

      <Link
        to="/dash/users"
        className="flex items-center gap-x-4 text-white bg-sky-900 rounded-sm px-3 py-2 w-60 text-sm hover:bg-sky-800 hover:w-64 duration-300"
      >
        <FontAwesomeIcon className="w-[15px]" icon={faUsers} />
        <p>View Users</p>
      </Link>

      <Link
        to="/dash/users"
        className="flex items-center gap-x-4 text-white bg-sky-900 rounded-sm px-3 py-2 w-60 text-sm hover:bg-sky-800 hover:w-64 duration-300"
      >
        <FontAwesomeIcon className="w-[15px]" icon={faUserGear} />
        <p>Account Settings</p>
      </Link>
    </section>
  );

  return content;
};

export default Welcome;
