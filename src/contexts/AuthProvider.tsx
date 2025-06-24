import { FullScreenLoader } from "@/components/common/fullscreen-loader";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

const AuthProvider = () => {
  // const { checkAuth, checkingAuth, isAuthenticated } = useAuthStore();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   checkAuth();
  //   console.log(`CHECKAUTH`);
  // }, []);

  // useEffect(() => {
  //   if (!checkingAuth && !isAuthenticated) {
  //     navigate("/login");
  //   }
  //   console.log(`ISAUTH : ${isAuthenticated}`);
  // }, [checkingAuth, isAuthenticated, navigate]);

  // if (checkingAuth) return <FullScreenLoader />;

  return <Outlet />;
};

export default AuthProvider;
