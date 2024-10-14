import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";

import NotFound from "./NotFound";

import UsersList from "./features/users/UsersList";
import NewUserForm from "./features/users/NewUserForm";
import EditUser from "./features/users/EditUser";

import StallsList from "./features/stalls/StallsList";
import EditStall from "./features/stalls/EditStall";
import Sections from "./features/stalls/Sections";

import SectionsList from "./features/rentals/SectionsList";
import RentStall from "./features/rentals/RentStall";

import VendorsList from "./features/vendors/VendorsList";
import NewVendorForm from "./features/vendors/NewVendorForm";
import EditVendor from "./features/vendors/EditVendor";

import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";

import Account from "./features/auth/Account";

function App() {
  useTitle("Tagoloan Public Market Stall FMS");
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              <Route path="dashboard" element={<DashLayout />}>
                <Route index element={<Welcome />} />
                <Route path="stalls">
                  <Route index element={<StallsList />} />
                  <Route path=":id" element={<EditStall />} />
                </Route>
                <Route path="rentals">
                  <Route index element={<SectionsList />} />
                  <Route path=":id" element={<RentStall />} />
                </Route>
                <Route path="vendors">
                  <Route index element={<VendorsList />} />
                  <Route path=":id" element={<EditVendor />} />
                  <Route
                    path="create"
                    element={
                      <RequireAuth allowedRoles={[ROLES.Administrator]} />
                    }
                  >
                    <Route index element={<NewVendorForm />} />
                  </Route>
                </Route>
                <Route path="account">
                  <Route index element={<Account />} />
                </Route>
                <Route
                  element={<RequireAuth allowedRoles={[ROLES.Administrator]} />}
                >
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="create" element={<NewUserForm />} />
                  </Route>
                  <Route path="sections">
                    <Route index element={<Sections />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>

        {/* Wildcard Route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
