import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faUserPlus } from "@fortawesome/free-solid-svg-icons";

import { toast } from "react-toastify";

import { useAddNewUserMutation } from "./usersApiSlice";
import { ROLES } from "../../config/roles";

const NewUserForm = () => {
  const [addNewUser, { isLoading, isSuccess, error }] = useAddNewUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [fullname, setFullname] = useState("");
  const [validFullname, setValidFullname] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [role, setRole] = useState("Staff");

  const [touchedUsername, setTouchedUsername] = useState(false);
  const [touchedFullname, setTouchedFullname] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);

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
    if (isSuccess) {
      setFullname("");
      setUsername("");
      setPassword("");
      setRole("Staff");
      toast.success("User added successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/dashboard/accounts");
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(
        error?.data?.message || "An error occurred. Please try again.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  }, [error]);

  const onUsernameChanged = (e) => {
    setUsername(e.target.value);
    setTouchedUsername(true);
  };

  const onFullnameChanged = (e) => {
    setFullname(e.target.value);
    setTouchedFullname(true);
  };

  const onPasswordChanged = (e) => {
    setPassword(e.target.value);
    setTouchedPassword(true);
  };
  const onRoleChanged = (e) => setRole(e.target.value);

  const canSave =
    [role, validUsername, validPassword, validFullname].every(Boolean) &&
    !isLoading;

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    setTouchedFullname(true);
    setTouchedUsername(true);
    setTouchedPassword(true);
    if (canSave) {
      await addNewUser({ fullname, username, password, role });
    }
  };

  const options = Object.values(ROLES).map((role) => {
    return (
      <option key={role} value={role}>
        {role}
      </option>
    );
  });

  const content = (
    <div className="p-5">
      <form
        className="w-[40rem] form-input bg-white/20 shadow-md rounded-md p-6"
        method="POST"
        onSubmit={onSaveUserClicked}
      >
        <div className="flex items-center gap-x-3 text-lg mb-7">
          <FontAwesomeIcon icon={faUserPlus} />
          <h3 className="text-sky-800 font-medium">Create new user</h3>
        </div>
        <section className="grid grid-cols-5 items-center gap-y-4 mb-10">
          <label htmlFor="fullname">Full name</label>
          <input
            type="text"
            name="fullname"
            placeholder="User's full name"
            value={fullname}
            onChange={onFullnameChanged}
            className={
              !validFullname && touchedFullname ? "border border-red-500" : ""
            }
          />
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            placeholder="User's username"
            value={username}
            className={
              !validUsername && touchedUsername ? "border border-red-500" : ""
            }
            onChange={onUsernameChanged}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Set up user's password"
            autoComplete="off"
            value={password}
            onChange={onPasswordChanged}
            className={
              !validPassword && touchedPassword ? "border border-red-500" : ""
            }
          />
          <label htmlFor="role">Role</label>
          <select name="role" value={role} onChange={onRoleChanged}>
            {options}
          </select>
        </section>
        <div className="flex">
          <button
            title="Save"
            className="btn-primary w-60 ml-auto"
            disabled={isLoading}
          >
            {isLoading && (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            )}
            <span>Submit</span>
          </button>
        </div>
      </form>
    </div>
  );

  return content;
};

export default NewUserForm;
