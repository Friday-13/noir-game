import { HTMLAttributes } from "react";
import styles from "./frame-box.module.scss";
function FrameBox(props: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={[styles.frameBox, props.className].join(" ")}>
      {props.children}
    </div>
  );
}

export default FrameBox;
