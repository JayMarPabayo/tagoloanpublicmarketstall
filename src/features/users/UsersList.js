import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "./usersApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faUserTie,
  faUser,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";

import User from "./User";
import Spinner from "../../utils/Spinner";

const UsersList = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const navigate = useNavigate();

  let content;

  if (isLoading) content = <Spinner />;

  if (isError) {
    content = <p className="error">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = users;

    const filteredIds = ids.filter((userId) => {
      const user = entities[userId];
      const matchesStatus =
        activeFilter === "all" ||
        (activeFilter === "active" && user.active === true) ||
        (activeFilter === "inactive" && user.active === false);

      const matchesRole =
        roleFilter === "all" ||
        (roleFilter === "staff" && user.role === "Staff") ||
        (roleFilter === "admin" && user.role === "Administrator");

      return matchesStatus && matchesRole;
    });

    const tableContent = filteredIds.length ? (
      filteredIds.map((userId) => <User key={userId} userId={userId} />)
    ) : (
      <tr>
        <td colSpan="5">No users found</td>
      </tr>
    );

    content = (
      <div className="grid grid-cols-12 p-5 gap-x-5">
        <div className="mb-2 flex items-center justify-between gap-x-4 col-span-full">
          <h1 className="font-semibold">Accounts</h1>
          <button
            className="rounded-md flex items-center text-xs font-medium gap-x-2 bg-white px-2 py-1"
            onClick={() => navigate(`/dashboard/account/create`)}
          >
            <FontAwesomeIcon icon={faCirclePlus} className="text-lg" />
            <div>Add New</div>
          </button>
        </div>
        <div className="bg-white/80 h-full col-span-2 p-2 text-sm">
          <h3 className="mb-2 opacity-70">Filter</h3>

          <div
            className={`flex items-center gap-x-2 px-2 py-1 mb-2 rounded-md cursor-pointer hover:bg-sky-400/30 duration-300 ${
              activeFilter === "active"
                ? "bg-sky-500/30 text-sky-600"
                : "hover:bg-sky-400/30"
            }`}
            onClick={() =>
              activeFilter === "active"
                ? setActiveFilter("all")
                : setActiveFilter("active")
            }
          >
            <FontAwesomeIcon icon={faCircleCheck} />
            <span>Active</span>
          </div>
          <div
            className={`flex items-center gap-x-2 px-2 py-1 mb-2 rounded-md cursor-pointer hover:bg-sky-400/30 duration-300 ${
              activeFilter === "inactive"
                ? "bg-sky-500/30 text-sky-600"
                : "hover:bg-sky-400/30"
            }`}
            onClick={() =>
              activeFilter === "inactive"
                ? setActiveFilter("all")
                : setActiveFilter("inactive")
            }
          >
            <FontAwesomeIcon icon={faCircleXmark} />
            <span>Inactive</span>
          </div>
          <hr className="mb-4" />
          <div
            className={`flex items-center gap-x-2 px-2 py-1 mb-2 rounded-md cursor-pointer hover:bg-sky-400/30 duration-300 ${
              roleFilter === "staff"
                ? "bg-sky-500/30 text-sky-600"
                : "hover:bg-sky-400/30"
            }`}
            onClick={() =>
              roleFilter === "staff"
                ? setRoleFilter("all")
                : setRoleFilter("staff")
            }
          >
            <FontAwesomeIcon icon={faUser} />
            <span>Staff</span>
          </div>
          <div
            className={`flex items-center gap-x-2 px-2 py-1 mb-2 rounded-md cursor-pointer hover:bg-sky-400/30 duration-300 ${
              roleFilter === "admin"
                ? "bg-sky-500/30 text-sky-600"
                : "hover:bg-sky-400/30"
            }`}
            onClick={() =>
              roleFilter === "admin"
                ? setRoleFilter("all")
                : setRoleFilter("admin")
            }
          >
            {" "}
            <FontAwesomeIcon icon={faUserTie} />
            <span>Administrator</span>
          </div>
        </div>
        <div className="col-span-10">
          <table className="w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Status</th>
                <th>Username</th>
                <th>Role</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>{tableContent}</tbody>
          </table>
        </div>
      </div>
    );
  }
  return content;
};

export default UsersList;
