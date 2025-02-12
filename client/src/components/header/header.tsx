import { useEffect, useState } from "react";
import styles from "./header.module.scss";
import clsx from "clsx";
import HeaderButton from "./header-button";
import { useAppDispatch } from "@/store/hooks";
import { increment } from "@/store/counter-slice";
import { Link, useLocation } from "react-router-dom";
import HeaderAuth from "./header-auth";

function Header() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isCollapsible, setIsCollapsible] = useState<boolean>(false);
  const location = useLocation();
  const dispatch = useAppDispatch();

  const headerContainerStyle = clsx(
    styles.headerContainer,
    isCollapsible && styles.headerContainerCollapsible,
    (!isCollapsible || isVisible) && styles.headerContainerShow
  );
  const headerStyle = clsx(
    styles.header,
    isCollapsible && styles.headerIsCollabsible
  );

  useEffect(() => {
    if (location.pathname == "/game") {
      setIsCollapsible(true);
    } else {
      setIsCollapsible(false);
    }
    console.log(location.pathname);
  }, [location]);

  return (
    <div className={headerContainerStyle}>
      <header className={headerStyle}>
        <div className={styles.headerContent}>
          <div>
            <Link to="/">
              <img src="logo.png" alt="logo" />
            </Link>
          </div>
          <h1>The Noir Game</h1>
          <HeaderAuth />
        </div>
        {isCollapsible && (
          <nav className={styles.headerMenuContainer}>
            <ul className={styles.headerMenu}>
              <li className={styles.headerMenuItem}>Available games</li>
              <li className={styles.headerMenuItem}>
                <Link to="">Menu</Link>
              </li>
              <li className={styles.headerMenuItem}>Start New Game</li>
            </ul>
          </nav>
        )}
        {isCollapsible && (
          <HeaderButton
            action={isVisible ? "hide" : "show"}
            onClick={() => {
              setIsVisible(!isVisible);
              dispatch(increment());
            }}
          />
        )}
      </header>
    </div>
  );
}

export default Header;
