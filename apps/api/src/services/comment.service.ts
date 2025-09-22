import {CommentRepository} from "../repositories/comment.repository.ts"
import {NotFoundError} from "../utils/errors/notFound.errors.ts"
import {PostRepository} from "../repositories/post.repository.ts"

export class CommentService{
  private readonly commentRepository : CommentRepository
  private readonly postRepository : PostRepository 

  constructor(commentRepository: CommentRepository , postRepository: PostRepository){
    this.commentRepository = commentRepository
    this.postRepository = postRepository
  }

  async commentLike(userId: string, commentId: string , post_id: string){
    const post = await this.postRepository.getPostById(post_id)
    const comment = await this.commentRepository.getCommentById(commentId)
    const existLike = await this.commentRepository.commentLikedBefore(userId,commentId)
    if (!post){
      throw new NotFoundError("NOT_FOUND" , "Post_not_find")
    }
    if (!comment) {
      throw new NotFoundError("NOT_FOUND" , "Comment_not_find") 
    }
    if(existLike) {
      throw new NotFoundError("ALREADY_DONE" , "User_liked_comment_Before")
    }

    await this.commentRepository.likeComment(userId, commentId)

  }

  async commentUnLike(userId: string, commentId: string , post_id: string){
    const post = await this.postRepository.getPostById(post_id)
    const comment = await this.commentRepository.getCommentById(commentId)
    const existLike = await this.commentRepository.commentLikedBefore(userId,commentId)
    if (!post){
      throw new NotFoundError("NOT_FOUND" , "Post_not_find")
    }
    if (!comment) {
      throw new NotFoundError("NOT_FOUND" , "Comment_not_find") 
    }
    if(!existLike) {
      throw new NotFoundError("NO_DATA_PROVIDED" , "User_Doesnt_liked_comment_Before")
    }

    await this.commentRepository.unLikeComment(userId, commentId)

  }
}


