import React from "react";
import Logo from "../assets/images/logo.png";
import SwitchTab from "./SwitchTab";

interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <div className="bg-[#F5F5F5] lg:w-[485px] w-[375] lg:h-[640px] h-[812] flex items-center flex-col rounded-lg gap-4 p-16">
      <img
        src={Logo}
        alt="logo rahnama"
        className="flex items-center justify-center"
      />
      <SwitchTab />
      {children}
    </div>
  );
};

export default AuthContainer;
