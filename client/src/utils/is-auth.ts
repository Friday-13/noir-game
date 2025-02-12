import ServerApi from "./server-api";
import { getNameOrEmail } from "./manage-nickname";
import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { AppDispatch } from "@/store/store";
import { login, logout } from "@/store/auth-slice";

async function initAuthState(dispatch: AppDispatch) {
  const token = ServerApi.getCsrfToken();
  const nickname = getNameOrEmail();
  if (token && nickname) {
    const response = await ServerApi.getProtected();
    if (response.ok) {
      dispatch(login({ nameOrEmail: nickname, token: token }));
      return;
    }
    dispatch(logout());
  }
}

function useInitAuthState() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    initAuthState(dispatch);
  }, [dispatch]);
}

export default useInitAuthState;
