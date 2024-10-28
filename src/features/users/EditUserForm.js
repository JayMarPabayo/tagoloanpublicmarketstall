import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faUserPlus } from "@fortawesome/free-solid-svg-icons";

import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { ROLES } from "../../config/roles";

import DeleteConfirmationModal from "../../utils/DeleteConfirmationModal";

const EditUserForm = ({ user }) => {
  const [updateUser, { isLoading, isSuccess, error }] = useUpdateUserMutation();
  const [
    deleteUser,
    { isLoading: isDelLoading, isSuccess: isDelSuccess, error: delerror },
  ] = useDeleteUserMutation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

  const [username, setUsername] = useState(user.username);
  const [validUsername, setValidUsername] = useState(false);
  const [fullname, setFullname] = useState(user.fullname);
  const [validFullname, setValidFullname] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [role, setRole] = useState(user.role);
  const [active, setActive] = useState(user.active);

  useEffect(() => {
    setValidUsername(username !== "");
  }, [username]);

  useEffect(() => {
    setValidPassword(password !== "");
  }, [password]);

  useEffect(() => {
    setValidFullname(fullname !== "");
  }, [fullname]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setUsername("");
      setPassword("");
      setFullname("");
      setRole("Staff");
      navigate("/dashboard/users");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onFullnameChanged = (e) => setFullname(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onRoleChanged = (e) => setRole(e.target.value);

  const onActiveChanged = () => setActive((prev) => !prev);

  const onUpdateUserClicked = async (e) => {
    if (password) {
      await updateUser({
        id: user.id,
        fullname,
        username,
        password,
        role,
        active,
      });
    } else {
      await updateUser({ id: user.id, fullname, username, role, active });
    }
  };

  const onDeleteUserClicked = async () => {
    setIsDeleteModalOpen(true);
  };
  const handleDeleteConfirm = async () => {
    setIsDeleteModalOpen(false);
    await deleteUser({ id: user.id });
  };
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  let canSave;
  if (password) {
    canSave =
      [role, validUsername, validPassword, validFullname].every(Boolean) &&
      !isLoading;
  } else {
    canSave = [role, validUsername, validFullname].every(Boolean) && !isLoading;
  }

  const errMessage = (error?.data?.message || delerror?.data?.message) ?? "";

  const content = (
    <>
      <div className="p-5">
        <form
          className="w-[40rem] form-input bg-white/20 shadow-md rounded-md p-6"
          method="POST"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-x-3 text-lg mb-7">
            <FontAwesomeIcon icon={faUserPlus} />
            <h3 className="text-sky-800 font-medium">Update User</h3>
            <span className="error ms-auto">{errMessage}</span>
          </div>
          <section className="grid grid-cols-5 items-center gap-y-4 mb-10">
            <label htmlFor="fullname">Full name</label>
            <input
              type="text"
              name="fullname"
              placeholder="User's full name"
              value={fullname}
              onChange={onFullnameChanged}
              className={!validFullname ? "border border-red-500" : ""}
            />
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              placeholder="User's username"
              value={username}
              onChange={onUsernameChanged}
              className={!validUsername ? "border border-red-500" : ""}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="User's password"
              autoComplete="off"
              value={password}
              onChange={onPasswordChanged}
              className={
                password && !validPassword ? "border border-red-500" : ""
              }
            />
            <label htmlFor="role" className="select-none cursor-pointer">
              Role
            </label>
            <select name="role" value={role} onChange={onRoleChanged}>
              {options}
            </select>
            <label htmlFor="active">Status</label>
            <div>
              <input
                name="active"
                type="checkbox"
                checked={active}
                onChange={onActiveChanged}
                className="hidden"
              />
              <div
                onClick={() => setActive((prev) => !prev)}
                className={`duration-300 ${
                  active
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : "bg-slate-500 hover:bg-slate-400"
                } text-white font-medium text-xs py-2 w-full rounded-lg text-center cursor-pointer`}
              >
                {active ? "Active" : "Inactive"}
              </div>
            </div>
          </section>

          <div className="flex items-center gap-x-5 justify-end">
            <button
              title="Delete"
              className="btn-secondary w-60"
              onClick={onDeleteUserClicked}
            >
              {isDelLoading && (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              )}
              <span>Delete</span>
            </button>
            <button
              title="Save"
              className="btn-primary w-60"
              disabled={!canSave}
              onClick={onUpdateUserClicked}
            >
              {isLoading && (
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              )}
              <span>Update</span>
            </button>
          </div>
        </form>
      </div>
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </>
  );

  return content;
};

export default EditUserForm;
