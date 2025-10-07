import Button from "@components/Button";
import EditProfileModal from "@/pages/profile/components/EditProfileModal";
import { useState } from "react";
import {
  useFollow,
  useUnFollow,
  useUserInfo,
} from "@hooks/user.hook";
import { MESSAGES } from "@/const/message";
import FollowersListModal from "./FollowersListModal";
import FollowingListModal from "./FollowingsListModal";
import UsernameIcon from "@assets/images/username.png";
import actionMenuIcon from "@assets/icons/actionMenu.svg";
import type { OtherUserType } from "@/types/user";

interface ProfileInfoProps {
  otherUser: OtherUserType | null;
}

const ProfileInfo = (props: ProfileInfoProps) => {
  const { otherUser } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFollowers, setOpenFollowers] = useState(false);
  const [openFollowing, setOpenFollowing] = useState(false);

  const { data: profile } = useUserInfo();

  const userInfo: OtherUserType = otherUser ? otherUser : profile;

  const { mutate: follow } = useFollow();
  const { mutate: unFollow } = useUnFollow();
  // const { mutate: acceptFollowRequest } = useAcceptFollowRequest(
  //   otherUser?.username ?? ""
  // );
  // const { mutate: rejectFollowRequest } = useRejectFollowRequest(
  //   otherUser?.username ?? ""
  // );

  const renderFollowButton = () => {
      if (!otherUser) return null;
      // if (otherUser.hasBlocked) {
      //   return (
      //     <Button
      //       label="دنبال کردن"
      //       className="px-5 py-1 mr-5 rounded-4xl bg-gray-400 text-white cursor-not-allowed"
      //       disabled
      //     />
      //   );
      // }
      if (otherUser.isFollowed === false) {
          return (
              <Button
                  label="دنبال کردن"
                  className="px-5 py-1 mr-5 rounded-4xl"
                  onClick={() => follow({followerUserId: otherUser.userId})}
              />
          );
      }
      if (otherUser.isFollowed === true) {
          return (
              <Button
                  label="دنبال نکردن"
                  className="px-5 py-1 mr-5 rounded-4xl"
                  onClick={() => unFollow({followerUserId: otherUser.userId})}
              />
          );
      }
      // if (otherUser.followStatus === "pending") {
      //   return (
      //     <Button
      //       label="لغو درخواست"
      //       className="px-5 py-1 mr-5 rounded-4xl"
      //       onClick={() =>
      //         acceptFollowRequest({ followerUserId: otherUser.userId })
      //       }
      //     />
      //   );
      // }
      // if (otherUser.followStatus === "accepted") {
      //   return (
      //     <Button
      //       label="دنبال نکردن"
      //       className="px-5 py-1 mr-5 rounded-4xl"
      //       onClick={() =>
      //         rejectFollowRequest({ followerUserId: otherUser.userId })
      //       }
      //     />
      //   );
      // }

      return (
          <Button
              label="دنبال نکردن"
              className="px-5 py-1 mr-5 rounded-4xl bg-gray-400 text-white"
              onClick={() => unFollow({followerUserId: otherUser.userId})}
          />
      );
  };

  return (
    <div className="profile-info-container w-full flex flex-col lg:flex-row lg:items-start gap-6 py-4 flex-justify">
      <div className="justify-center lg:justify-start hidden md:flex">
        <div className="bg-white rounded-full bg-cover object-cover ">
          <img
            src={
              userInfo?.profilePhotoUrl
                ? userInfo?.profilePhotoUrl
                : UsernameIcon
            }
            className="h-[134px] w-[134px] bg-cover no-repeat rounded-full"
          />
        </div>
      </div>

      <div className="flex flex-col flex-1 mt-4">
        <div className="flex items-center gap-3 p-2 rounded-xl md:hidden">
          <img
            src={
              userInfo?.profilePhotoUrl
                ? userInfo?.profilePhotoUrl
                : UsernameIcon
            }
            alt="user"
            className="w-14 h-14 sm:w-14 sm:h-14 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-semibold text-gray-800">
              {userInfo?.firstname && userInfo?.lastname
                ? `${userInfo?.firstname} ${userInfo?.lastname}`
                : "کاربر کالج گرام"}
            </span>
            <span className="text-xs sm:text-sm text-gray-500">
              @{userInfo?.username}
            </span>
          </div>
        </div>

        <div className=" flex-col lg:flex-row lg:items-center lg:gap-6 hidden md:flex">
          <div className="flex flex-row items-center gap-2 mb-3 justify-center lg:justify-start">
            <div className="text-lg md:text-2xl font-bold mb-1">
              {userInfo?.firstname === null && userInfo?.lastname === null
                ? "کاربر کالج گرام"
                : `${userInfo?.firstname || ""}  ${userInfo?.lastname || ""}`}
            </div>
            <span className="text-sm lg:text-base font-light mr-3 ">
              {userInfo?.username}
            </span>
            {otherUser && renderFollowButton()}
          </div>
        </div>

        <div className="flex flex-row justify-center lg:justify-start items-center  text-md w-full ">
          <div className="flex flex-row justify-start items-center lg:w-5/6">
            <div
              className="cursor-pointer text-orange-500 pl-4 border-l border-gray-500"
              onClick={() => setOpenFollowing(true)}>
              <span className="px-1">{userInfo?.following_count || 0}</span>
              <span>{MESSAGES.following}</span>
            </div>
            <div
              className="cursor-pointer text-orange-500 px-4 border-l border-gray-500 "
              onClick={() => setOpenFollowers(true)}>
              <span className="px-1">{userInfo?.follower_count || 0} </span>
              <span>{MESSAGES.follower}</span>
            </div>
            <div className="cursor-pointer px-4">
              <span className="px-1"> </span>
              <span>{userInfo?.post_count || 0}</span>
              <span>{MESSAGES.post} </span>
            </div>
          </div>
          <div className=" lg:block lg:w-1/6 justify-end">
            {otherUser ? (
              <img src={actionMenuIcon} className="flex justify-end" />
            ) : (
              <Button
                type="button"
                label="ویرایش پروفایل"
                variant="danger"
                className="lg:w-[197] h-[52px]"
                onClick={() => setIsModalOpen(true)}
              />
            )}
          </div>
        </div>

        <div className="text-center lg:text-right text-xs lg:text-sm text-[#b5b5b5] mt-2">
          {userInfo?.biography}
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <FollowersListModal
        isOpen={openFollowers}
        onClose={() => setOpenFollowers(false)}
        title="دنبال‌شونده‌ها"
        onItemAction={(user) => console.log(user)}
      />

      <FollowingListModal
        isOpen={openFollowing}
        onClose={() => setOpenFollowing(false)}
        title="دنبال‌کننده‌ها"
        onItemAction={(user) => console.log(user)}
      />
    </div>
  );
};

export default ProfileInfo;