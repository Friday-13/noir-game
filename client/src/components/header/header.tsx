import { useState } from "react";
import styles from "./header.module.scss";
import clsx from "clsx";
import HeaderButton from "./header-button";

interface IHeaderProps {
  isCollapsible: boolean;
}
function Header(props: IHeaderProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const headerContainerStyle = clsx(
    styles.headerContainer,
    isVisible && styles.headerContainerShow
  );
  const headerStyle = clsx(
    styles.header,
    props.isCollapsible && styles.headerIsCollabsible
  );

  return (
    <div className={headerContainerStyle}>
      <header className={headerStyle}>
        <div className={styles.headerContent}>
          <div>
            <img src="logo.png" alt="logo" />
          </div>
          <h1>The Noir Game</h1>
          <ul className={styles.headerAuthContainer}>
            <li className={styles.headerAuthItem}>Logout</li>
          </ul>
        </div>
        {props.isCollapsible && (
          <nav className={styles.headerMenuContainer}>
            <ul className={styles.headerMenu}>
              <li className={styles.headerMenuItem}>Available games</li>
              <li className={styles.headerMenuItem}>Menu</li>
              <li className={styles.headerMenuItem}>Start New Game</li>
            </ul>
          </nav>
        )}
        {props.isCollapsible && (
          <HeaderButton
            action={isVisible ? "hide" : "show"}
            onClick={() => setIsVisible(!isVisible)}
          />
        )}
      </header>
    </div>
  );
}

export default Header;
