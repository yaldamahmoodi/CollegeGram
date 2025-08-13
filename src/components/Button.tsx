import React from "react";

interface AuthContainerProps  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
//   onClick?: () => void;
}

const Button = (props: AuthContainerProps) => {
    const {onClick, children, type , className,...rest} = props

    return (
        <button
        onClick = {onClick}
        type = {type}
        className={className}
        {...rest}
        >
            {children}
        </button>
  );
};

export default Button;
