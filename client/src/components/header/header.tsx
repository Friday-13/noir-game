import { useState } from "react";
import styles from "./header.module.scss";

function Header() {
  const [isActive, setIsActive] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);
  return (
    <div className={styles.headerContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <img src="logo.png" alt="logo" />
          </div>
          <h1>The Noir Game</h1>
          <ul className={styles.headerAuthContainer}>
            <li className={styles.headerAuthItem}>Logout</li>
          </ul>
        </div>
        <nav className={styles.headerMenuContainer}>
          <ul className={styles.headerMenu}>
            <li className={styles.headerMenuItem}>Available games</li>
            <li className={styles.headerMenuItem}>Menu</li>
            <li className={styles.headerMenuItem}>Start New Game</li>
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Header;
