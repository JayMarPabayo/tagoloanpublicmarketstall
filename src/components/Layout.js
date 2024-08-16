import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Outlet />
      <img
        src={`${process.env.PUBLIC_URL}/market.png`}
        alt="Market"
        className="opacity-70 fixed bottom-10 right-0 max-w-[50rem] -z-50"
      />
    </div>
  );
};

export default Layout;
