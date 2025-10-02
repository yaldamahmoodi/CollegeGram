import { PostRepository } from "../repositories/post.repository.ts";
import { NotFoundError } from "../utils/errors/notFound.errors.ts";
import type { SaveRepository } from "../repositories/save.repository.ts";
import { AlreadyDoneError } from "../utils/errors/alreadyDone.errors.ts";
import { BadRequestErrors } from "../utils/errors/badRequest.errors.ts";
import { type InsertPostDto } from "../db/models/post.model.ts";
import { ValidationError } from "../utils/errors/validation.errors.ts";
import { InternalErrors } from "../utils/errors/internal.errors.ts";
import type { CommentRepository } from "../repositories/comment.repository.ts";
import type { InsertCommentDto } from "../db/models/comment.model.ts";
import type { NotificationService } from "./notification.service.ts";

export class PostService {
  private readonly postRepository: PostRepository;
  private readonly saveRepository: SaveRepository;
  private readonly commentRepository: CommentRepository;
  private readonly notificationService: NotificationService;

  constructor(
    postRepository: PostRepository,
    saveRepository: SaveRepository,
    commentRepository: CommentRepository,
    notificationService: NotificationService
  ) {
    this.postRepository = postRepository;
    this.saveRepository = saveRepository;
    this.commentRepository = commentRepository;
    this.notificationService = notificationService;
  }

  async createPost(postData: InsertPostDto) {
    if (postData.urls.length < 1) {
      throw new ValidationError("INVALID_CREDENTIALS");
    }
    // Validate all mentioned users exist
    if (postData.mentions && postData.mentions.length > 0) {
      const mentionValidationPromises = postData.mentions.map(
        async (mention) => {
          try {
            await this.getUserDetails(mention.user_id);
            return true;
          } catch (error) {
            return false;
          }
        }
      );

      const validationResults = await Promise.all(mentionValidationPromises);
      const allExist = validationResults.every((result) => result === true);

      if (!allExist) {
        throw new ValidationError("INVALID_USERNAME");
      }
    }

    const post = await this.postRepository.createPost(postData);

    // Send mention notifications
    for (const mention of postData.mentions) {
      const sender = await this.postRepository.findUserDetails(
        postData.user_id
      );
      if (sender) {
        await this.notificationService.createMentionNotification(
          mention.user_id,
          postData.user_id,
          sender.username,
          post._id.toString(),
          postData.caption
        );
      }
    }

    return post;
  }

  async getUserDetails(userId: string) {
    const userDetails = await this.postRepository.findUserDetails(userId);
    if (!userDetails) {
      throw new NotFoundError("NOT_FOUND_USER");
    }
    return userDetails;
  }

  async getPosts(userId: string, page: number, pageSize: number) {
    return await this.postRepository.findUserPosts(userId, page, pageSize);
  }

  async getPost(postId: string, userId?: string) {
    const post = await this.postRepository.getPostById(postId, userId);
    if (!post) {
      throw new NotFoundError("NOT_FOUND");
    }
    return post;
  }

  async likePost(userId: string, postId: string) {
    await this.getPost(postId);
    await this.postRepository.likePost(userId, postId);
    
    const post = await this.postRepository.getPostById(postId);
    
    if (post && post.user_id?.toString() !== userId) {
      const sender = await this.postRepository.findUserDetails(userId);
      console.log("Sender details:", { sender: sender?.username });
      
      const senderUsername = sender?.username || "";
      if (senderUsername) {
        try {
          const notification = await this.notificationService.createLikeNotification(
            post.user_id['_id'].toString(),
            userId,
            senderUsername,
            postId,
            post?.caption || ""
          );
          
          console.log("Notification result:", notification ? "CREATED" : "SKIPPED");
        } catch (e) {
          console.error("createLikeNotification failed:", e);
        }
      } else {
        console.log("No sender username found");
      }
    } else {
      console.log("Skipping notification - self like or no post");
    }
  }

  async unLikePost(userId: string, postId: string) {
    await this.getPost(postId);
    await this.postRepository.unLikePost(userId, postId);
  }

  async savePost(userId: string, postId: string) {
    const postExistence = await this.postRepository.getPostById(postId);
    if (!postExistence) throw new NotFoundError("NOT_FOUND");

    const save = await this.saveRepository.savePost(postId, userId);
    if (save.acknowledged == false)
      throw new InternalErrors("INTERNAL_SERVER_ERROR");

    if (save.upsertedCount > 0) {
      await this.postRepository.updatePostSaveCount(postId, 1);
    }

    if (save.upsertedCount == 0) {
      throw new AlreadyDoneError("ALREADY_SAVED", "post already saved");
    }

    return save;
  }

  async unsavePost(userId: string, postId: string) {
    const postExistence = await this.postRepository.getPostById(postId);
    if (!postExistence) {
      throw new NotFoundError("NOT_FOUND");
    }
    const existingSave = await this.saveRepository.findSave(postId, userId);
    if (!existingSave) {
      throw new BadRequestErrors("NOT_SAVED", "Post already not saved");
    }
    await this.postRepository.updatePostSaveCount(postId, -1);
    return this.saveRepository.unsavePost(userId, postId);
  }

  async getSavePosts(userId: string, page: number, pageSize: number) {
    const savePosts = await this.saveRepository.getSavesListByUserId(
      userId,
      page,
      pageSize
    );
    if (savePosts.data.length === 0) {
      throw new NotFoundError("SAVE_NOT_FOUND");
    }
    return savePosts;
  }

  async explore(userId: string, page: number, pageSize: number) {
    return await this.postRepository.explore(userId, page, pageSize);
  }

  async getMentionedPosts(userId: string, page: number, pageSize: number) {
    return await this.postRepository.getMentionedPosts(userId, page, pageSize);
  }

  async addComment(userId: string, commentData: InsertCommentDto) {
    const post = await this.postRepository.getPostById(commentData.post_id);
    if (!post) throw new NotFoundError("NOT_FOUND");

    if (commentData.parent_comment) {
      const parent = await this.commentRepository.findCommentById(
        commentData.parent_comment
      );
      if (!parent) throw new NotFoundError("NOT_FOUND");
    }

    const comment = await this.commentRepository.createComment(
      userId,
      commentData.post_id,
      commentData.content,
      commentData.parent_comment || null
    );

    // Send notification to post owner
    if (post.user_id.toString() !== userId) {
      const sender = await this.postRepository.findUserDetails(userId);
      if (sender) {
        await this.notificationService.createCommentNotification(
          post.user_id.toString(),
          userId,
          sender.username,
          commentData.post_id,
          comment._id.toString(),
          commentData.content,
          post.caption
        );
      }
    }

    // If this is a reply, also notify the parent comment author
    if (commentData.parent_comment) {
      const parentComment = await this.commentRepository.findCommentById(
        commentData.parent_comment
      );
      if (parentComment && parentComment.user_id.toString() !== userId) {
        const sender = await this.postRepository.findUserDetails(userId);
        if (sender) {
          await this.notificationService.createReplyNotification(
            parentComment.user_id.toString(),
            userId,
            sender.username,
            commentData.post_id,
            comment._id.toString(),
            commentData.content
          );
        }
      }
    }

    return comment;
  }

  async getCommentsByPost(postId: string, page: number, pageSize: number) {
    const post = await this.postRepository.getPostById(postId);
    if (!post) throw new NotFoundError("NOT_FOUND");

    const skip = (page - 1) * pageSize;

    const test = this.commentRepository.getCommentsByPostId(
      postId,
      skip,
      pageSize
    );
    // console.log(test,'testy')
    return test;
  }
}
