import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import classes from "./CreateEvent.module.css";

type InputProps = {
  inputType: string;
  inputPlaceholder: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
};
const InputComponent: React.FC<InputProps> = ({ inputType, inputPlaceholder, register, error }) => {
  return (
    <div className={classes.inputElementBox}>
      <input
        type={inputType}
        placeholder={inputPlaceholder}
        className={`${classes.inputElements}
        ${error ? classes.inputError : ""}`}
        {...register}
      />
      {error && <p className={classes.errorMessage}>{error.message}</p>}
    </div>
  );
};

export default InputComponent;
