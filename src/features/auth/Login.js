import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  return (
    <section className="bg-cover bg-center h-screen flex items-center justify-center gap-x-10">
      <img
        src="/meedo.png"
        alt="Meedo Logo"
        className="w-[20rem] animate-slow-spin rounded-full shadow-lg p-0"
      />
      <main className="text-indigo-900 w-[35rem]">
        <form action="#" method="POST">
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
              <input type="text" name="username" placeholder="Username" />
            </label>
            <label htmlFor="password" className="custom-label">
              <FontAwesomeIcon icon={faKey} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="off"
              />
            </label>
            <button className="btn-primary">Log in</button>
          </section>
        </form>
      </main>
    </section>
  );
};

export default Login;
