import { HTMLAttributes } from "react";
import styles from "./icon.module.scss";

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  size: number;
}

function Icon({ src, alt, size, className, ...rest }: IconProps) {
  return (
    <div
      className={[styles.iconContainer, className].join(" ")}
      style={{ width: `${size}px` }}
      {...rest}
    >
      <img src={src} alt={alt} />
    </div>
  );
}

export default Icon;
