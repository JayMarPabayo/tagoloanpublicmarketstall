import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faUsers,
  faPersonShelter,
  faUserGear,
  faUserPlus,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";

import useAuth from "../../hooks/useAuth";

const Welcome = () => {
  const { isAdministrator } = useAuth();

  useEffect(() => {
    if (!sessionStorage.getItem("hasRefreshed")) {
      sessionStorage.setItem("hasRefreshed", "true");
      window.location.reload();
    }
  }, []);

  const content = (
    <section className="flex flex-col gap-y-2">
      {isAdministrator && (
        <Link
          to="/dashboard/rentals"
          className="flex items-center gap-x-4 text-white bg-sky-900 rounded-sm px-3 py-2 w-60 text-sm hover:bg-sky-800 hover:w-64 duration-300"
        >
          <FontAwesomeIcon className="w-[15px]" icon={faWarehouse} />
          <p>Rental System</p>
        </Link>
      )}

      <Link
        to="/dashboard/stalls"
        className="flex items-center gap-x-4 text-white bg-sky-900 rounded-sm px-3 py-2 w-60 text-sm hover:bg-sky-800 hover:w-64 duration-300"
      >
        <FontAwesomeIcon className="w-[15px]" icon={faStore} />
        <p>View Stalls</p>
      </Link>

      {isAdministrator && (
        <Link
          to="/dashboard/sections"
          className="flex items-center gap-x-4 text-white bg-sky-900 rounded-sm px-3 py-2 w-60 text-sm hover:bg-sky-800 hover:w-64 duration-300"
        >
          <FontAwesomeIcon className="w-[15px]" icon={faUserPlus} />
          <p>Add Stalls</p>
        </Link>
      )}

      <Link
        to="/dashboard/vendors"
        className="flex items-center gap-x-4 text-white bg-sky-900 rounded-sm px-3 py-2 w-60 text-sm hover:bg-sky-800 hover:w-64 duration-300"
      >
        <FontAwesomeIcon className="w-[15px]" icon={faPersonShelter} />
        <p>View Vendors</p>
      </Link>

      {isAdministrator && (
        <Link
          to="/dashboard/vendors/create"
          className="flex items-center gap-x-4 text-white bg-sky-900 rounded-sm px-3 py-2 w-60 text-sm hover:bg-sky-800 hover:w-64 duration-300"
        >
          <FontAwesomeIcon className="w-[15px]" icon={faUserPlus} />
          <p>Add New Vendor</p>
        </Link>
      )}

      {isAdministrator && (
        <Link
          to="/dashboard/users"
          className="flex items-center gap-x-4 text-white bg-sky-900 rounded-sm px-3 py-2 w-60 text-sm hover:bg-sky-800 hover:w-64 duration-300"
        >
          <FontAwesomeIcon className="w-[15px]" icon={faUsers} />
          <p>View Users</p>
        </Link>
      )}

      {isAdministrator && (
        <Link
          to="/dashboard/users/create"
          className="flex items-center gap-x-4 text-white bg-sky-900 rounded-sm px-3 py-2 w-60 text-sm hover:bg-sky-800 hover:w-64 duration-300"
        >
          <FontAwesomeIcon className="w-[15px]" icon={faUserPlus} />
          <p>Add New User</p>
        </Link>
      )}

      <Link
        to="/dashboard/account"
        className="flex items-center gap-x-4 text-white bg-sky-900 rounded-sm px-3 py-2 w-60 text-sm hover:bg-sky-800 hover:w-64 duration-300"
      >
        <FontAwesomeIcon className="w-[15px]" icon={faUserGear} />
        <p>Account</p>
      </Link>
    </section>
  );

  return content;
};

export default Welcome;
