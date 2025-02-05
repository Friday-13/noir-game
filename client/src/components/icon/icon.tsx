import { HTMLAttributes } from "react";
import styles from "./icon.module.scss";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  size: number;
}

function Icon(props: IconProps) {
  return (
    <div
      className={[styles.iconContainer, props.className].join(" ")}
      style={{ width: `${props.size}px` }}
    >
      <img src={props.src} alt={props.alt} />
    </div>
  );
}

export default Icon;
