import { HTMLAttributes } from "react";
import styles from "./form.module.scss";
import clsx from "clsx";

const Form = ({ className, ...restProps }: HTMLAttributes<HTMLFormElement>) => {
  const formStyle = clsx(styles.form, className);

  return <form className={formStyle} {...restProps}></form>;
};

export default Form;
