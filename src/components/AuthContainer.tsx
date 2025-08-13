import React from "react";

interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <div className="bg-white h-50 w-50 px-5 flex items-center justify-center rounded-lg">
      {children}
    </div>
  );
};

export default AuthContainer;
