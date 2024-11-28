import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faGears } from "@fortawesome/free-solid-svg-icons";

import { toast } from "react-toastify";

import { useGetUsersQuery } from "../users/usersApiSlice";
import { useUpdateAccountMutation } from "./authApiSlice";
import useAuth from "../../hooks/useAuth";

const Account = () => {
  const { id } = useAuth();
  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });

  const [updateUser, { isLoading, isSuccess, error }] =
    useUpdateAccountMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [fullname, setFullname] = useState("");
  const [validFullname, setValidFullname] = useState(false);

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypeNewPassword, setRetypeNewPassword] = useState("");
  const [validNewPassword, setValidNewPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [touchedNewPassword, setTouchedNewPassword] = useState(false);

  useEffect(() => {
    setValidUsername(username !== "");
  }, [username]);

  useEffect(() => {
    setValidFullname(fullname !== "");
  }, [fullname]);

  useEffect(() => {
    setValidNewPassword(newPassword !== "" && password !== "");
  }, [newPassword, password]);

  useEffect(() => {
    setUsername(user?.username || "");
    setFullname(user?.fullname || "");
  }, [user]);

  let errMessage = error?.data?.message ?? "";
  let successMessage = isSuccess ? "Profile Updated Successfully." : "";

  useEffect(() => {
    if (isSuccess) {
      setPassword("");
      setNewPassword("");
      setRetypeNewPassword("");
      setTouchedNewPassword(false);
      toast.success(successMessage || "Profile updated successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/dashboard/profile");
    }
  }, [isSuccess, successMessage, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(errMessage || "An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [error, errMessage]);

  useEffect(() => {
    setPasswordsMatch(newPassword === retypeNewPassword);
  }, [newPassword, retypeNewPassword]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onFullnameChanged = (e) => setFullname(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onNewPasswordChanged = (e) => {
    setTouchedNewPassword(true);
    setNewPassword(e.target.value);
  };
  const onRetypeNewPasswordChanged = (e) =>
    setRetypeNewPassword(e.target.value);

  const onUpdateUserClicked = async () => {
    setTouchedNewPassword(true);

    const updatePayload = { id: user.id, fullname, username };

    if (newPassword && passwordsMatch) {
      updatePayload.password = password;
      updatePayload.newPassword = newPassword;
    }

    await updateUser(updatePayload);
  };

  let canSave;
  if (newPassword) {
    canSave =
      [validUsername, validFullname, validNewPassword, passwordsMatch].every(
        Boolean
      ) && !isLoading;
  } else {
    canSave = [validUsername, validFullname].every(Boolean) && !isLoading;
  }

  const content = (
    <>
      <div className="p-5">
        <form
          className="form-input bg-white/20 shadow-md rounded-md p-6 w-full sm:w-[50rem] mx-auto"
          method="POST"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-x-3 text-lg mb-7">
            <FontAwesomeIcon icon={faGears} />
            <h3 className="text-sky-800 font-medium">Account</h3>
          </div>
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 items-center gap-x-5 gap-y-4 mb-10">
            <label htmlFor="fullname">Full name</label>
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={fullname}
              onChange={onFullnameChanged}
              className={`w-full ${
                !validFullname ? "border border-red-500" : ""
              }`}
            />
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={onUsernameChanged}
              className={`w-full ${
                !validUsername ? "border border-red-500" : ""
              }`}
            />

            <hr className="col-span-3 md:col-span-full" />

            <label htmlFor="password">Current Password</label>
            <input
              type="password"
              name="password"
              placeholder="Current Password"
              autoComplete="off"
              value={password}
              onChange={onPasswordChanged}
              className="w-full"
            />

            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              name="new-password"
              placeholder="New Password"
              autoComplete="off"
              value={newPassword}
              onChange={onNewPasswordChanged}
              className={`w-full ${
                !validNewPassword && touchedNewPassword
                  ? "border border-red-500"
                  : ""
              }`}
            />

            <label htmlFor="retype-new-password">Retype New Password</label>
            <input
              type="password"
              name="retype-new-password"
              placeholder="Retype New Password"
              autoComplete="off"
              value={retypeNewPassword}
              onChange={onRetypeNewPasswordChanged}
              className="w-full"
            />

            {!passwordsMatch && retypeNewPassword !== "" && (
              <p className="error col-span-full">Passwords do not match.</p>
            )}
          </section>
          <div className="flex flex-col sm:flex-row items-center gap-x-5 gap-y-3 justify-end">
            <button
              title="Save"
              className="btn-primary w-full sm:w-60"
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
    </>
  );

  return content;
};

export default Account;
