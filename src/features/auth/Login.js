import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";

import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";

import FullScreenLoading from "../../utils/FullScreenLoading";

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

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
      navigate("/dashboard");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
      // errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);

  const errClass = errMsg ? "error" : "hidden";

  if (isLoading) return <FullScreenLoading />;

  const content = (
    <section className="bg-cover bg-center h-screen flex items-center justify-center gap-x-10">
      <img
        src="/meedo.png"
        alt="Meedo Logo"
        className="w-[20rem] animate-slow-spin rounded-full shadow-lg p-0"
      />
      <main className="text-indigo-900 w-[35rem]">
        <form onSubmit={handleSubmit}>
          <section className="flex flex-col gap-y-1 mb-8">
            <h3 className="text-xl text-sky-800 font-medium">Log in</h3>
            <div className="flex items-center gap-x-5">
              <p className="text-sm text-slate-500/80">
                Please sign in to continue
              </p>
              <div className="h-[0.07rem] bg-sky-700/30 grow"></div>
            </div>
          </section>
          <section className="flex flex-col gap-y-5">
            <label htmlFor="username" className="custom-label">
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
              />
            </label>
            <label htmlFor="password" className="custom-label">
              <FontAwesomeIcon icon={faKey} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="off"
                onChange={handlePwdInput}
                value={password}
                required
              />
            </label>
            <p ref={errRef} className={errClass} aria-live="assertive">
              {errMsg}
            </p>
            <button className="btn-primary">Log in</button>
          </section>
        </form>
      </main>
    </section>
  );

  return content;
};

export default Login;
