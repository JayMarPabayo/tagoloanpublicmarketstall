import { Outlet } from "react-router-dom";
import DashHeader from "./DashHeader";
import DashFooter from "./DashFooter";

const DashLayout = () => {
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <DashHeader />
      <div className="px-3 grow">
        <Outlet />
      </div>
      <DashFooter />
    </div>
  );
};

export default DashLayout;
