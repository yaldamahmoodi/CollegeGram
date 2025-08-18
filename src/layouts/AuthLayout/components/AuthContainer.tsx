import React from "react";
import Logo from "@/assets/images/logo.png";
import SwitchTab from "./AuthSwitchTab";

interface AuthContainerProps {
  children: React.ReactNode;
}

const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <div className="bg-[#F5F5F5] lg:w-[30rem] w-[23rem] lg:h-[40rem] h-[50rem] flex items-center flex-col rounded-lg gap-4 p-16">
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
