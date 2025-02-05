import { useState } from "react";
import styles from "./header.module.scss";
import FrameBox from "../frame-box/frame-box";
import { CaretUp } from "phosphor-react-native";
import Icon from "../icon/icon";

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
        <FrameBox className={styles.headerShowBtn}>
          <Icon
            src="/src/assets/icons/caret-up.svg"
            alt="fold-menu"
            size={32}
          />
        </FrameBox>
      </header>
    </div>
  );
}

export default Header;
