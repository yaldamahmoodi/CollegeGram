import type {Authenticate} from "../middlewares/auth.middleware.ts";
import type {NextFunction, Response, Request} from "express";
import type {CommentService} from "../services/comment.service.ts";
import {APIError} from "../utils/errors/api.errors.ts";

export class CommentController {

    private readonly commentService: CommentService;

    constructor(commentService: CommentService) {
        this.commentService = commentService;
        this.likeComment = this.likeComment.bind(this)
        this.unLikeComment = this.unLikeComment.bind(this)
    }

    async likeComment(req: Authenticate, res: Response, next: NextFunction){
      try{
        await this.commentService.commentLike(req.user.id , req.body.comment_id , req.body.post_id)
        return res.status(200).json({
          code: "LIKED_SUCCESSFULY",
          message: `comment ${req.body.comment_id} liked successfully.`
        })
        } catch (error) {
          if (error instanceof APIError) return next(error);
        }  
    }

    async unLikeComment(req: Authenticate, res: Response, next: NextFunction){
      try{
        await this.commentService.commentUnLike(req.user.id , req.body.comment_id , req.body.post_id)
        return res.status(200).json({
          code: "UNLIKED_SUCCESSFULY",
          message: `comment ${req.body.comment_id} unliked successfully.`
        })
        } catch (error) {
          if (error instanceof APIError) return next(error);
        }  
    }

  }


