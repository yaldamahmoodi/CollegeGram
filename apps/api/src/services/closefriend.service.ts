import type {CloseFriendRepository} from "../repositories/closefriend.repository.ts";
import {BadRequestErrors} from "../utils/errors/badRequest.errors.ts";
import {AlreadyDoneError} from "../utils/errors/alreadyDone.errors.ts";
import {NotFoundError} from "../utils/errors/notFound.errors.ts";

export class CloseFriendService {
    private readonly closeFriendRepository: CloseFriendRepository;

    constructor(closeFriendRepository: CloseFriendRepository) {
        this.closeFriendRepository = closeFriendRepository;
    }

    async addToCloseFriend(userId: string, friendId: string) {
        if (userId === friendId) {
            throw new BadRequestErrors("CAN_NOT_ADD_YOURSELF_TO_CLOSE_FRIEND");
        }

        const result = await this.closeFriendRepository.addToCloseFriend(userId, friendId);

        if (result.upsertedCount === 0) {
            throw new AlreadyDoneError("ALREADY_DONE", "user already exists in closeFriend");
        }

        return result;
    }

    async removeFromCloseFriend(userId: string, friendId: string) {

        const result = await this.closeFriendRepository.removeFromCloseFriend(userId, friendId);
        if (!result.deletedCount || result.deletedCount === 0) {
            throw new NotFoundError('NOT_FOUND', 'user does not exists in closeFriend');
        }
    }

    async getCloseFriendList(userId: string) {
        return await this.closeFriendRepository.getCloseFriendList(userId);
    }

}
