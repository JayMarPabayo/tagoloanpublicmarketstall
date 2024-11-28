import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";

import { toast } from "react-toastify";

import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";

import FullScreenLoading from "../../utils/FullScreenLoading";

const Login = () => {
  const userRef = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      sessionStorage.removeItem("hasRefreshed");
      setUsername("");
      setPassword("");
      toast.success("Login successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        onClose: () => {
          if (!sessionStorage.getItem("hasRefreshed")) {
            sessionStorage.setItem("hasRefreshed", "true");
            window.location.reload();
          }
        },
      });
      navigate("/dashboard");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Incorrect Credentials");
      } else {
        setErrMsg(err.data?.message);
      }
      // errRef.current.focus();
    }
  };

  useEffect(() => {
    if (errMsg) {
      toast.error(errMsg || "An error occurred. Please try again.", {
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
  }, [errMsg]);

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);

  if (isLoading) return <FullScreenLoading />;

  const content = (
    <section className="bg-cover bg-center min-h-screen flex flex-col md:flex-row items-center justify-center p-4 md:p-10 gap-y-8 md:gap-x-10">
      <img
        src="/meedo.png"
        alt="Meedo Logo"
        className="w-[10rem] md:w-[20rem] animate-slow-spin rounded-full shadow-lg p-0"
      />
      <main className="text-indigo-900 w-full md:w-[35rem]">
        <form onSubmit={handleSubmit}>
          <section className="flex flex-col gap-y-1 mb-4 md:mb-8">
            <h3 className="text-lg md:text-xl text-sky-800 font-medium">
              Log in
            </h3>
            <div className="flex items-center gap-x-2 md:gap-x-5">
              <p className="text-xs md:text-sm text-slate-500/80">
                Please sign in to continue
              </p>
              <div className="h-[0.07rem] bg-sky-700/30 grow"></div>
            </div>
          </section>
          <section className="flex flex-col gap-y-4 md:gap-y-5">
            <label
              htmlFor="username"
              className="custom-label flex items-center gap-x-2"
            >
              <FontAwesomeIcon icon={faUser} />
              <input
                type="text"
                name="username"
                placeholder="Username"
                ref={userRef}
                value={username}
                onChange={handleUserInput}
                autoComplete="off"
                required
                className="w-full py-2 px-3 text-sm md:text-base border rounded"
              />
            </label>
            <label
              htmlFor="password"
              className="custom-label flex items-center gap-x-2"
            >
              <FontAwesomeIcon icon={faKey} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="off"
                onChange={handlePwdInput}
                value={password}
                required
                className="w-full py-2 px-3 text-sm md:text-base border rounded"
              />
            </label>
            <button className="btn-primary w-full md:w-auto py-2 md:py-3 text-sm md:text-base">
              Log in
            </button>
          </section>
        </form>
      </main>
    </section>
  );

  return content;
};

export default Login;
