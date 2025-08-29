import React from "react";
import avatar from "@/assets/images/avatar.png";
import account from "@/assets/icons/account.svg"

const SideBar = () => {
  return (
    <div className="p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={avatar}
          alt="profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="text-gray-800 font-semibold">mahzm</span>
      </div>
      <hr className="border-gray-200 mb-4" />
      <div className="flex flex-col gap-2">
        <button className="flex items-center justify-right text-gray-700 w-full px-4 py-2 rounded-xl transition bg-gray-100 hover:bg-gray-200">
          <img 
          src={account}
          />
          <span className="text-gray-700">صفحه من</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
