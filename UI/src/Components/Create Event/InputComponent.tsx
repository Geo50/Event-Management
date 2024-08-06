import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import classes from "./CreateEvent.module.css";

type InputProps = {
  inputType: string;
  inputPlaceholder: string;
  value: string | number;
};

export type ComponentFunctions = {
  handleValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | number;
  handleAddErrorClass: () => void;
  handleRemoveErrorClass: () => void;
};

const InputComponent = forwardRef<ComponentFunctions, InputProps>(
  (props, ref) => {
    const [inputValue, setInputValue] = useState<string | number>(props.value);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      handleValueChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
      },
      handleAddErrorClass: () => {
        inputRef.current?.classList.add(classes.inputError);
      },
      handleRemoveErrorClass: () => {
        inputRef.current?.classList.remove(classes.inputError);
      },
      value: inputValue,
    }));

    return (
      <div className={classes.inputElementBox}>
        <input
          type={props.inputType}
          placeholder={props.inputPlaceholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={classes.inputElements}
          ref={inputRef}
        />
      </div>
    );
  }
);

export default InputComponent;
