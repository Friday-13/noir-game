import ServerApi from "./server-api";
import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { AppDispatch } from "@/store/store";
import { ICredentials, setAuth } from "@/store/auth-slice";
import { removeNameOrEmail } from "./manage-nickname";

async function initAuthState(dispatch: AppDispatch) {
  const token = ServerApi.getCsrfRefreshToken();
  if (token) {
    //TODO: Change endpoint to special, that return name
    const response = await ServerApi.getProtected();
    if (!response.ok) {
      dispatch(setAuth({ user: null, isAuth: false, error: null }));
      removeNameOrEmail();
      return;
    }
    const credentials: ICredentials = await response.json();
    dispatch(setAuth({ user: credentials, isAuth: true, error: null }));
  }
}

function useInitAuthState() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    initAuthState(dispatch);
  }, [dispatch]);
}

export default useInitAuthState;
