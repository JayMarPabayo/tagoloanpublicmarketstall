import { useNavigate } from "react-router-dom";
import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faUserTie,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import { useGetUsersQuery } from "./usersApiSlice";

const User = ({ userId }) => {
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });
  const navigate = useNavigate();

  if (user) {
    const handleEdit = () => navigate(`/dashboard/users/${userId}`);

    const status =
      user.active === true ? (
        <span className="bg-emerald-600 text-white font-medium text-xs py-1 px-3 rounded-lg text-center">
          Active
        </span>
      ) : (
        <span className="bg-gray-400 text-white font-medium text-xs py-1 px-3 rounded-lg text-center">
          Inactive
        </span>
      );

    const roleIcon =
      user.role === "Administrator" ? (
        <FontAwesomeIcon icon={faUserTie} />
      ) : (
        <FontAwesomeIcon icon={faUser} />
      );

    return (
      <tr>
        <td>{user.fullname}</td>
        <td>{status}</td>
        <td>{user.username}</td>
        <td>
          <div className="flex items-center gap-x-2">
            {roleIcon}
            <div>{user.role}</div>
          </div>
        </td>
        <td>
          <button onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } else return null;
};

const memoizedUser = memo(User);

export default memoizedUser;
