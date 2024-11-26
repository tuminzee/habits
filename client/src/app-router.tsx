import { Routes, Route, Navigate } from "react-router-dom";
// import Chat from "@/pages/protected/chat";
// import Setting from "@/pages/protected/setting";
import Contact from "@/pages/protected/contact";
import Streak from "@/pages/protected/streak";

import AuthLayout from "@/pages/auth/auth-layout";
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Navigate to="/streak" replace />} />
        {/* <Route path="/chat" element={<Chat />} /> */}
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/settings" element={<Setting />} /> */}
        <Route path="/streak" element={<Streak />} />
      </Route>
      <Route path="*" element={<div>404</div>} /> {/* Default Route */}
    </Routes>
  );
};

export default AppRouter;
