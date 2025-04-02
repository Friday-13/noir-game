import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function useOnlyUnauthorized() {
  const navigate = useNavigate();
  const authState = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (authState.isAuth) {
      navigate("/");
    }
  }, [authState.isAuth, navigate]);
}

export default useOnlyUnauthorized;
