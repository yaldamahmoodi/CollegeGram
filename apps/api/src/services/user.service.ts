import type { UserRepository } from "../repositories/user.repository.ts";
import type { ProfileRepository } from "../repositories/profile.repository.ts";
import bcrypt from "bcrypt";
import type { updateProfileUserSchema } from "../db/models/user.model.ts";
import { NotFoundError } from "../utils/errors/notFound.errors.ts";
import type { FollowRepository } from "../repositories/follow.repository.ts";
import type { BlockRepository } from "../repositories/block.repository.ts";
import type { CloseFriendRepository } from "../repositories/closefriend.repository.ts";
import { AlreadyDoneError } from "../utils/errors/alreadyDone.errors.ts";
import { BadRequestErrors } from "../utils/errors/badRequest.errors.ts";
import type { NotificationService } from "./notification.service.ts";

export class UserService {
  private readonly userRepository: UserRepository;
  private readonly profilePhotoRepository: ProfileRepository;
  private readonly followRepository: FollowRepository;
  private readonly blockRepository: BlockRepository;
  private readonly closeFriendRepository: CloseFriendRepository;
  private readonly notificationService: NotificationService;

  constructor(
    userRepository: UserRepository,
    profilePhotoRepository: ProfileRepository,
    followRepository: FollowRepository,
    blockRepository: BlockRepository,
    closeFriendRepository: CloseFriendRepository,
    notificationService: NotificationService
  ) {
    this.userRepository = userRepository;
    this.profilePhotoRepository = profilePhotoRepository;
    this.followRepository = followRepository;
    this.blockRepository = blockRepository;
    this.closeFriendRepository = closeFriendRepository;
    this.notificationService = notificationService;
  }

  async getUserIdByUsername(username: string): Promise<string | null> {
    return await this.userRepository.findUserIdByUsername(username);
  }

  async uploadProfile(filePath: string, userId: string) {
    const findUserById = await this.userRepository.findByUserId(userId);
    if (!findUserById) {
      throw new NotFoundError("NOT_FOUND_USER");
    }

    return await this.profilePhotoRepository.upsertProfilePhoto(
      findUserById._id,
      filePath
    );
  }

  async getProfile(userId: string) {
    const userDetails = await this.userRepository.findUserDetails(userId);
    if (!userDetails) {
      throw new NotFoundError("NOT_FOUND_USER");
    }
    return userDetails;
  }

  async updateProfile(userId: string, userData: updateProfileUserSchema) {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    return await this.userRepository.updateUser(userId, userData);
  }

  async followUser(userId: string, followedUserId: string) {
    if (await this.blockRepository.blockedBefore(userId, followedUserId)) {
      throw new NotFoundError("YOU_CANNOT_FOLLOW_BLOCKEDUSER");
    }

    const result = await this.followRepository.followUser(
      userId,
      followedUserId
    );

    // Create follow notification
    try {
      // Get the follower's username for the notification
      const follower = await this.userRepository.findByUserId(userId);
      if (follower) {
        await this.notificationService.createFollowNotification(
          followedUserId, // recipient (the person being followed)
          userId, // sender (the person who followed)
          follower.username
        );
      }
    } catch (error) {
      // Log error but don't fail the follow operation
      console.error("Failed to create follow notification:", error);
    }

    return result;
  }

  async unfollowUser(userId: string, unfollowedUserId: string) {
    if (await this.blockRepository.blockedBefore(userId, unfollowedUserId)) {
      throw new NotFoundError("YOU_CANNOT_UNFOLLOW_BLOCKEDUSER");
    }
    return await this.followRepository.unfollowUser(userId, unfollowedUserId);
  }

  async getFollowings(userId: string) {
    return this.followRepository.getFollowings(userId);
  }

  async getFollowers(userId: string) {
    return this.followRepository.getFollowers(userId);
  }

  async acceptFollowRequest(userId: string, followerUserId: string) {
    return await this.followRepository.acceptFollowRequest(
      followerUserId,
      userId
    );
  }

  async rejectFollowRequest(userId: string, followerUserId: string) {
    return await this.followRepository.rejectFollowRequest(
      followerUserId,
      userId
    );
  }

  async getFollowStatus(followerUserId: string, followingUserId: string) {
    return await this.followRepository.getFollowStatus(
      followerUserId,
      followingUserId
    );
  }

  async getOtherProfile(loggedInUserId: string, targetUsername: string) {
    const userDetails = await this.userRepository.findUserDetailsByUsername(
      targetUsername
    );
    if (!userDetails) {
      throw new NotFoundError("NOT_FOUND_USER");
    }

    const followStatus = await this.getFollowStatus(
      loggedInUserId,
      userDetails._id.toString()
    );

    const isBlockedResult = await this.blockRepository.blockedBefore(
      loggedInUserId,
      userDetails._id.toString()
    );
    const isBlocked = !!isBlockedResult;

    const hasBlockedResult = await this.blockRepository.blockedBefore(
      userDetails._id.toString(),
      loggedInUserId
    );
    const hasBlocked = !!hasBlockedResult;

    const isCloseFriendResult = await this.closeFriendRepository.isCloseFriend(
      loggedInUserId,
      userDetails._id.toString()
    );
    const isCloseFriend = !!isCloseFriendResult;

    return {
      ...userDetails,
      followStatus,
      isBlocked,
      hasBlocked,
      isCloseFriend,
    };
  }

  async blockUser(userId: string, blockedId: string) {
    const existUserId = await this.userRepository.findByUserId(userId);
    const existBlockedId = await this.userRepository.findByUserId(blockedId);
    const blokedBefore = await this.blockRepository.blockedBefore(
      userId,
      blockedId
    );
    const closeFriendBefore = await this.closeFriendRepository.isCloseFriend(
      userId,
      blockedId
    );
    if (closeFriendBefore) {
      await this.closeFriendRepository.removeFromCloseFriend(userId, blockedId);
    }

    if (!existUserId) {
      throw new NotFoundError("NOT_FOUND_USER", "userId not found");
    }
    if (!existBlockedId) {
      throw new NotFoundError("NOT_FOUND_USER", "blockedId not found");
    }
    if (blokedBefore) {
      throw new AlreadyDoneError("ALREADY_DONE", "user already blocked");
    }
    await this.blockRepository.block(userId, blockedId);
    if (await this.followRepository.isFollowed(userId, blockedId)) {
      await this.followRepository.unfollowUser(userId, blockedId);
    }
    if (await this.followRepository.isFollowed(blockedId, userId)) {
      await this.followRepository.unfollowUser(blockedId, userId);
    }
  }

  async unBlockUser(userId: string, blockedId: string) {
    const existUserId = await this.userRepository.findByUserId(userId);
    const existBlockedId = await this.userRepository.findByUserId(blockedId);
    const blokedBefore = await this.blockRepository.blockedBefore(
      userId,
      blockedId
    );
    if (!existUserId) {
      throw new NotFoundError("NOT_FOUND_USER", "userId not found");
    }
    if (!existBlockedId) {
      throw new NotFoundError("NOT_FOUND_USER", "blockedId not found");
    }
    if (!blokedBefore) {
      throw new BadRequestErrors("NOT_BLOCKED", "User is not blocked");
    }

    await this.blockRepository.unblock(userId, blockedId);
  }

  async getBlocks(userId: string) {
    return this.blockRepository.getblocks(userId);
  }
}
