import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import UsersList from "./features/users/UsersList";
import NewUserForm from "./features/users/NewUserForm";
import EditUser from "./features/users/EditUser";
import StallsList from "./features/stalls/StallsList";
import VendorsList from "./features/vendors/VendorsList";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";

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
                </Route>
                <Route path="vendors">
                  <Route index element={<VendorsList />} />
                </Route>
                <Route
                  element={<RequireAuth allowedRoles={[ROLES.Administrator]} />}
                >
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="create" element={<NewUserForm />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
