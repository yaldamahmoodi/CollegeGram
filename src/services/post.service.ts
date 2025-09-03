
import {PostRepository} from "../repositories/post.repository.ts";
import {NotFoundError} from "../utils/errors/notFound.errors.ts";

export class PostService {

    private readonly postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
    }


    async getPostByID(postId: string) {
        const post = await this.postRepository.findPost(postId);
        if (!post) {
            throw new NotFoundError("NOT_FOUND");
        }
        return post;
        
    }
}