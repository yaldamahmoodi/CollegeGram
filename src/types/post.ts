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

export interface CreateSavePostPayload {
    postId: string;
}
export interface CreateUnSavePostPayload {
    postId: string
}
