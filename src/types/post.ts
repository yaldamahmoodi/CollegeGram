export interface CreatePostPayload {
  photos: File[];
  caption?: string;
}


export interface CreateLikePostPayload {
  postId: string
}
export interface CreateUnLikePostPayload {
  postId: string
}
