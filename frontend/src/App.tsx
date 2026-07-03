import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Docs from "./pages/Docs";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import CompleteProfile from "./pages/Onboarding";
import { AppShell } from "./components/app-shell";
import Overview from "./pages/app/Overview";
import PurchaseOrders from "./pages/app/PurchaseOrders";
import Suppliers from "./pages/app/Suppliers";
import Settlements from "./pages/app/Settlements";
import VirtualAccounts from "./pages/app/VirtualAccounts";
import Subscriptions from "./pages/app/Subscriptions";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/onboarding" element={<CompleteProfile />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Overview />} />
        <Route path="purchase-orders" element={<PurchaseOrders />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="settlements" element={<Settlements />} />
        <Route path="virtual-accounts" element={<VirtualAccounts />} />
        <Route path="subscriptions" element={<Subscriptions />} />
      </Route>
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
