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

// import StallsList from "./features/stalls/StallsList";
import EditStall from "./features/stalls/EditStall";
import Sections from "./features/stalls/Sections";

import SectionsList from "./features/rentals/SectionsList";
import RentStall from "./features/rentals/RentStall";
import ViewStall from "./features/rentals/ViewStall";
import RentalsList from "./features/rentals/RentalsList";

import VendorsList from "./features/vendors/VendorsList";
import NewVendorForm from "./features/vendors/NewVendorForm";
import EditVendor from "./features/vendors/EditVendor";
import LeaseForm from "./features/vendors/LeaseForm";

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
                <Route path="renting">
                  <Route index element={<SectionsList />} />
                  <Route path=":id" element={<RentStall />} />
                  <Route path="view/:id" element={<ViewStall />} />
                </Route>
                <Route path="collection">
                  <Route index element={<RentalsList />} />
                </Route>
                <Route path="vendors">
                  <Route index element={<VendorsList />} />
                  <Route path=":id" element={<EditVendor />} />
                  <Route path="lease/:id" element={<LeaseForm />} />
                  <Route
                    path="create"
                    element={
                      <RequireAuth allowedRoles={[ROLES.Administrator]} />
                    }
                  >
                    <Route index element={<NewVendorForm />} />
                  </Route>
                </Route>
                <Route path="profile">
                  <Route index element={<Account />} />
                </Route>
                <Route
                  element={<RequireAuth allowedRoles={[ROLES.Administrator]} />}
                >
                  <Route path="accounts">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="create" element={<NewUserForm />} />
                  </Route>
                  <Route path="sections">
                    <Route index element={<Sections />} />
                    <Route path="stalls">
                      <Route path=":id" element={<EditStall />} />
                    </Route>
                  </Route>
                  <Route path="collection">
                    <Route index element={<RentalsList />} />
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
