import { logout } from "@/store/auth-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeNameOrEmail } from "@/utils/manage-nickname";
import { Link, useNavigate } from "react-router-dom";
import styles from "./header.module.scss";
import { MouseEvent } from "react";

function HeaderAuth() {
  const authState = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const logoutHandler = (event: MouseEvent) => {
    event.preventDefault();
    dispatch(logout());
    removeNameOrEmail();
    navigate("/");
  };

  return (
    <ul className={styles.headerAuthContainer}>
      {authState.isAuth ? (
        <li className={styles.headerAuthItem} onClick={logoutHandler}>
          Logout
        </li>
      ) : (
        <>
          <li className={styles.headerAuthItem}>
            <Link to="login"> Login</Link>
          </li>
          <li className={styles.headerAuthItem}>
            <Link to="register"> Register </Link>
          </li>
        </>
      )}
    </ul>
  );
}

export default HeaderAuth;
