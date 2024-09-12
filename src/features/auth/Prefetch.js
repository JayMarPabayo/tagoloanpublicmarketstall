import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import { store } from "../../app/store";
import { vendorsApiSlice } from "../vendors/vendorsApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { sectionsApiSlice } from "../stalls/sectionsApiSlice";

const Prefetch = () => {
  useEffect(() => {
    store.dispatch(
      vendorsApiSlice.util.prefetch("getVendors", "vendorsList", {
        force: true,
      })
    );
    store.dispatch(
      usersApiSlice.util.prefetch("getUsers", "usersList", { force: true })
    );
    store.dispatch(
      sectionsApiSlice.util.prefetch("getSections", "sectionsList", {
        force: true,
      })
    );
  }, []);

  return <Outlet />;
};
export default Prefetch;
