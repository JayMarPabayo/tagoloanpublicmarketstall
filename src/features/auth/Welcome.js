import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faUsers,
  faPersonShelter,
  faUserGear,
  faWarehouse,
  faHandHoldingHand,
} from "@fortawesome/free-solid-svg-icons";

import useAuth from "../../hooks/useAuth";
import ImageCarousel from "../../components/ImageCarousel";

const Welcome = () => {
  const { isAdministrator, isStaff } = useAuth();

  useEffect(() => {
    if (!sessionStorage.getItem("hasRefreshed")) {
      sessionStorage.setItem("hasRefreshed", "true");
      window.location.reload();
    }
  }, []);

  const content = (
    <div className="flex w-full justify-between -mt-4">
      <section className="flex flex-col gap-y-2 w-1/4 mt-4">
        {isAdministrator && (
          <>
            <Link
              to="/dashboard/collection"
              className="flex items-center gap-x-4 text-white bg-sky-900 rounded-sm px-3 py-2 w-60 text-sm hover:bg-sky-800 hover:w-64 duration-300"
            >
              <FontAwesomeIcon className="w-[15px]" icon={faHandHoldingHand} />
              <p>Collection</p>
            </Link>
            <Link
              to="/dashboard/renting"
              className="flex items-center gap-x-4 text-white bg-sky-900 rounded-sm px-3 py-2 w-60 text-sm hover:bg-sky-800 hover:w-64 duration-300"
            >
              <FontAwesomeIcon className="w-[15px]" icon={faWarehouse} />
              <p>Renting</p>
            </Link>
          </>
        )}

        {isStaff && (
          <Link
            to="/dashboard/collection"
            className="flex items-center gap-x-4 text-white bg-sky-900 rounded-sm px-3 py-2 w-60 text-sm hover:bg-sky-800 hover:w-64 duration-300"
          >
            <FontAwesomeIcon className="w-[15px]" icon={faHandHoldingHand} />
            <p>Collection</p>
          </Link>
        )}

        {isAdministrator && (
          <>
            <Link
              to="/dashboard/sections"
              className="flex items-center gap-x-4 text-white bg-sky-900 rounded-sm px-3 py-2 w-60 text-sm hover:bg-sky-800 hover:w-64 duration-300"
            >
              <FontAwesomeIcon className="w-[15px]" icon={faStore} />
              <p>Stalls</p>
            </Link>

            <Link
              to="/dashboard/vendors"
              className="flex items-center gap-x-4 text-white bg-sky-900 rounded-sm px-3 py-2 w-60 text-sm hover:bg-sky-800 hover:w-64 duration-300"
            >
              <FontAwesomeIcon className="w-[15px]" icon={faPersonShelter} />
              <p>Vendors</p>
            </Link>
            <Link
              to="/dashboard/accounts"
              className="flex items-center gap-x-4 text-white bg-sky-900 rounded-sm px-3 py-2 w-60 text-sm hover:bg-sky-800 hover:w-64 duration-300"
            >
              <FontAwesomeIcon className="w-[15px]" icon={faUsers} />
              <p>Manage Accounts</p>
            </Link>
          </>
        )}

        <Link
          to="/dashboard/profile"
          className="flex items-center gap-x-4 text-white bg-sky-900 rounded-sm px-3 py-2 w-60 text-sm hover:bg-sky-800 hover:w-64 duration-300"
        >
          <FontAwesomeIcon className="w-[15px]" icon={faUserGear} />
          <p>Profile</p>
        </Link>
      </section>
      <div className="carousel-section flex-1 h-full rounded-md pe-10">
        <ImageCarousel />
      </div>
    </div>
  );

  return content;
};

export default Welcome;
