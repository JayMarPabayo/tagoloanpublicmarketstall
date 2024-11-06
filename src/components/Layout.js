import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Outlet />
      <img
        src={`${process.env.PUBLIC_URL}/market.png`}
        alt="Market"
        className="opacity-50 fixed bottom-10 right-0 max-w-[50rem] -z-50 hidden md:block"
      />
    </div>
  );
};

export default Layout;
