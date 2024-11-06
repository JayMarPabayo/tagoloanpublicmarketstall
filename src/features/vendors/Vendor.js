import { useNavigate } from "react-router-dom";
import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShop,
  faCircleUser,
  faMapLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

import { useGetVendorsQuery } from "./vendorsApiSlice";

const Vendor = ({ vendorId }) => {
  const { vendor } = useGetVendorsQuery("vendorsList", {
    selectFromResult: ({ data }) => ({
      vendor: data?.entities[vendorId],
    }),
  });

  const navigate = useNavigate();

  if (vendor) {
    const handleEdit = () => navigate(`/dashboard/vendors/${vendorId}`);

    return (
      <li
        onDoubleClick={handleEdit}
        className="bg-white rounded-md col-span-1 shadow-md cursor-pointer hover:bg-white/50 hover:shadow-lg hover:scale-105 active:scale-95 duration-300"
      >
        <div
          title="Store"
          className="py-1 px-2 text-sm bg-sky-800 text-white flex items-center gap-x-2 rounded-t-md"
        >
          <FontAwesomeIcon icon={faShop} />
          <span>{vendor.owner}</span>
        </div>
        <div className="p-2 text-sky-800 text-xs flex flex-col gap-y-2">
          <div title="Owner" className="flex items-center gap-x-2">
            <FontAwesomeIcon icon={faCircleUser} />
            <span className="font-bold">{vendor.name}</span>
          </div>
          <div title="Address" className="flex items-start gap-x-2">
            <FontAwesomeIcon icon={faMapLocationDot} />
            <span>{vendor.address}</span>
          </div>
          <div title="Contact" className="flex items-center gap-x-2">
            <FontAwesomeIcon icon={faPhone} />
            <span>{vendor.contact}</span>
          </div>
        </div>
      </li>
    );
  } else return null;
};

const memoizedVendor = memo(Vendor);

export default memoizedVendor;
