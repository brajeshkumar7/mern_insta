import React from "react";
import classNames from "classnames";
import "./Input.css";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface InputProps<T extends FieldValues> {
  label: string;
  type: "text" | "password" | "file" | "email" | "number";
  name: Path<T>;
  value?: string | number;
  error?: string;
  register: UseFormRegister<T>;
  placeholder?: string;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = <T extends FieldValues>({
  label,
  type,
  name,
  value,
  placeholder,
  error,
  register,
  className,
  onChange,
}: InputProps<T>) => {
  return (
    <div className={classNames("input-container", className)}>
      <label className="input-label" htmlFor={name}>
        {label}
      </label>
      <input
        className={type === "file" ? "file-input" : "input-control"}
        {...register(name)}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        accept={type === "file" ? ".jpg, .jpeg, .png" : undefined}
        onChange={onChange}
      />
      <div className="input-error-container">
        {error && <span className="input-error">{error}</span>}
      </div>
    </div>
  );
};

export default Input;
