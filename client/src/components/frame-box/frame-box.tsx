import { HTMLAttributes } from "react";
import styles from "./frame-box.module.scss";
import clsx from "clsx";
function FrameBox({ className, ...restProps }: HTMLAttributes<HTMLDivElement>) {
  const boxStyle = clsx(styles.frameBox, className);
  return (
    <div className={boxStyle} {...restProps}>
      {restProps.children}
    </div>
  );
}

export default FrameBox;
