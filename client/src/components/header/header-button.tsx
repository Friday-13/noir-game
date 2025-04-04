import { HTMLAttributes } from "react";
import FrameBox from "../frame-box/frame-box";
import Icon from "../icon/icon";
import styles from "./header.module.scss";
import showIcon from "@/assets/icons/caret-down.svg";
import hideIcon from "@/assets/icons/caret-up.svg";
import clsx from "clsx";

interface IHeaderButton extends HTMLAttributes<HTMLDivElement> {
  action: "show" | "hide";
}

const HeaderButton = (props: IHeaderButton) => {
  const icon = props.action == "show" ? showIcon : hideIcon;
  const style = clsx(
    styles.headerShowBtn,
    props.action == "hide" && styles.headerShowBtnHideMenu,
  );
  return (
    <FrameBox className={style} onClick={props.onClick}>
      <Icon src={icon} alt="fold-menu" size={32} />
    </FrameBox>
  );
};

export default HeaderButton;
