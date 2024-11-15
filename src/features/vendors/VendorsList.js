import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faCirclePlus,
  faMagnifyingGlass,
  // faStoreSlash,
} from "@fortawesome/free-solid-svg-icons";

import { useGetVendorsQuery } from "./vendorsApiSlice";

import Vendor from "./Vendor";
import Spinner from "../../utils/Spinner";

const VendorsList = () => {
  const [sortOption, setSortOption] = useState("owner");
  const [searchTerm, setSearchTerm] = useState("");

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

  const navigate = useNavigate();

  let content;

  if (isLoading) content = <Spinner />;

  if (isError) {
    content = <p>{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = vendors;

    const filteredIds = ids.filter((vendorId) => {
      const vendor = entities[vendorId];
      return (
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.owner.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    const sortedIds = [...filteredIds].sort((a, b) => {
      if (sortOption === "name") {
        return entities[a].name.localeCompare(entities[b].name);
      } else if (sortOption === "owner") {
        return entities[a].owner.localeCompare(entities[b].owner);
      }
      return 0;
    });

    const tableContent = sortedIds.length ? (
      sortedIds.map((vendorId) => <Vendor key={vendorId} vendorId={vendorId} />)
    ) : (
      <p>No vendors found.</p>
    );

    content = (
      <div className="grid grid-cols-12 p-5 gap-x-5">
        <div className="mb-2 col-span-full grid gap-x-2 grid-cols-12">
          <div className="col-span-2">
            <h1 className="font-semibold">Vendors</h1>
          </div>
          <div className="col-span-10 flex justify-start items-center gap-x-2">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sky-800 outline-slate-200 hover:outline-slate-400 duration-300 rounded-md text-xs w-96 tracking-wide p-2"
            />
            <button
              className="rounded-md ms-auto flex items-center text-xs font-medium gap-x-2 bg-white px-2 py-1"
              onClick={() => navigate(`/dashboard/vendors/create`)}
            >
              <FontAwesomeIcon icon={faCirclePlus} className="text-lg" />
              <div>Add New</div>
            </button>
          </div>
        </div>
        <div className="bg-white/80 h-full col-span-2 p-2 text-sm">
          <h3 className="mb-2 opacity-70">Sort</h3>
          <div
            className={`flex items-center gap-x-2 px-2 py-1 mb-2 rounded-md cursor-pointer duration-300 ${
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
