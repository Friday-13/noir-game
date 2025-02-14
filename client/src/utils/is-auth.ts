import ServerApi from "./server-api";
import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { AppDispatch } from "@/store/store";
import { ICredentials, login, logout } from "@/store/auth-slice";

async function initAuthState(dispatch: AppDispatch) {
  const token = ServerApi.getCsrfRefreshToken();
  if (token) {
    const response = await ServerApi.refresh();
    if (!response.ok) {
      dispatch(logout());
      return;
    }
    const credentials: ICredentials = await response.json();
    dispatch(login(credentials));
  }
}

function useInitAuthState() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    initAuthState(dispatch);
  }, [dispatch]);
}

export default useInitAuthState;
