import React from "react";
import Logo from "@assets/images/logo.png";
import SwitchTab from "./AuthSwitchTab";

interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <div className="bg-[#F5F5F5] lg:w-[30rem] w-[23rem]   flex items-center flex-col rounded-[1.5rem] gap-11 p-16">
      <img
        src={Logo}
        alt="logo"
        className="flex items-center justify-center no-repeat"
      />
      <SwitchTab />
      {children}
    </div>
  );
};

export default AuthContainer;
