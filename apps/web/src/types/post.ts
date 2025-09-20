export interface CreatePostPayload {
  photos: File[];
  caption?: string;
  mentions?: MentionsType[];
}

export type MentionsType = {
  user_id: string;
  username: string;
};

export interface PostInfo {
  _id: string;
  user_id: string;
  urls: string[];
  caption: string;
  photo_length: number;
  like_count: number;
  save_count: number;
  mention: MentionsType[];
  hashtag_array: string[];
}

export interface Posts {
  data: PostInfo[];
  totalCount: number;
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
