export interface CreatePostPayload {
  photos: File[];
  caption?: string;
}

export interface CreateLikePostPayload {
  postId: string;
}
export interface CreateUnLikePostPayload {
  postId: string;
}

export interface CreateSavePostPayload {
  postId: string;
}
export interface CreateUnSavePostPayload {
  postId: string;
}
export interface SavedPostType {
  _id: string;
  postOwner: string;
  createdAt: Date;
  updatedAt: Date;
  firstUrl: string;
  like_count: number;
  save_count: number;
  mentions: [];
  hashtag_array: [];
  photo_length: number;
}
