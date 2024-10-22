import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShop,
  faCircleUser,
  faStore,
  faStoreSlash,
} from "@fortawesome/free-solid-svg-icons";

import { useGetVendorsQuery } from "./vendorsApiSlice";

import Vendor from "./Vendor";
import Spinner from "../../utils/Spinner";

const VendorsList = () => {
  const [sortOption, setSortOption] = useState("name");
  const [filterOption, setFilterOption] = useState("all");

  const {
    data: vendors,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetVendorsQuery("vendorsList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <Spinner />;

  if (isError) {
    content = <p>{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = vendors;

    const filteredIds = ids.filter((vendorId) => {
      if (filterOption === "withStall") {
        return entities[vendorId].hasRental === true;
      } else if (filterOption === "withoutStall") {
        return entities[vendorId].hasRental === false;
      }
      return true; // If "all", return all vendors
    });

    const sortedIds = [...filteredIds].sort((a, b) => {
      if (sortOption === "name") {
        return entities[a].name.localeCompare(entities[b].name);
      } else if (sortOption === "owner") {
        return entities[a].owner.localeCompare(entities[b].owner);
      }
      return 0;
    });

    const tableContent = sortedIds.length
      ? sortedIds.map((vendorId) => (
          <Vendor key={vendorId} vendorId={vendorId} />
        ))
      : null;

    content = (
      <div className="grid grid-cols-12 p-5 gap-x-5">
        <div className="bg-white/80 h-full col-span-2 p-2 text-sm">
          <h3 className="mb-2 opacity-70">Filter</h3>
          <div
            className={`flex items-center gap-x-2 px-2 py-1 mb-2 rounded-md cursor-pointer duration-300 ${
              filterOption === "withStall"
                ? "bg-sky-500/30 text-sky-600"
                : "hover:bg-sky-400/30"
            }`}
            onClick={() =>
              filterOption === "withStall"
                ? setFilterOption("all")
                : setFilterOption("withStall")
            }
          >
            <FontAwesomeIcon icon={faStore} />
            <span>With stall</span>
          </div>

          <div
            className={`flex items-center gap-x-2 px-2 py-1 mb-4 rounded-md cursor-pointer duration-300 ${
              filterOption === "withoutStall"
                ? "bg-sky-500/30 text-sky-600"
                : "hover:bg-sky-400/30"
            }`}
            onClick={() =>
              filterOption === "withoutStall"
                ? setFilterOption("all")
                : setFilterOption("withoutStall")
            }
          >
            <FontAwesomeIcon icon={faStoreSlash} />
            <span>Without stall</span>
          </div>

          <h3 className="mb-2 opacity-70">Sort</h3>

          <div
            className={`flex items-center gap-x-2 px-2 py-1 mb-2 rounded-md cursor-pointer duration-300 ${
              sortOption === "name"
                ? "bg-sky-500/30 text-sky-600"
                : "hover:bg-sky-400/30"
            }`}
            onClick={() => setSortOption("name")}
          >
            <FontAwesomeIcon icon={faShop} />
            <span>Store name</span>
          </div>

          <div
            className={`flex items-center gap-x-2 px-2 py-1 mb-4 rounded-md cursor-pointer duration-300 ${
              sortOption === "owner"
                ? "bg-sky-500/30 text-sky-600"
                : "hover:bg-sky-400/30"
            }`}
            onClick={() => setSortOption("owner")}
          >
            <FontAwesomeIcon icon={faCircleUser} />
            <span>Owner name</span>
          </div>
        </div>
        <ul className="w-full grid grid-cols-5 gap-x-5 gap-y-5 col-span-10">
          {tableContent}
        </ul>
      </div>
    );
  }
  return content;
};

export default VendorsList;
