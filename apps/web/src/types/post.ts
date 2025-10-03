export interface PostDataType {
  _id: string;
  user_id: string;
  urls: string[];
  caption: string;
  like_count: number;
  save_count: number;
  mentions: string[];
  hashtag_array: string[];
  photo_length: number;
  createdAt: string;
}

export interface CreatePostPayload {
  photos: File[];
  caption?: string;
  mentions?: MentionsType[];
  isClose?: boolean;
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
  mentions: MentionsType[];
  hashtag_array: string[];
  isLiked?: boolean;
  isSaved?: boolean;
  isClose?: boolean;
  createdAt: string;
}

export interface Posts {
  data: PostInfo[];
  totalCount: number;
}

export interface PostActionPayloadType {
  postId: string | undefined;
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

export interface CreateCommentPayloadType {
  post_id: string | undefined;
  content: string;
  parent_comment?: string;
}

export interface CreateCommentResponseType {
  _id: string;
  post_id: string;
  user_id: string;
  content: string;
  like_count: number;
  parent_comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImageGroupProps {
  urls: string | string[];
  onClick?: () => void;
  showIcon?: boolean;
  photoCount?: number;
  className?: string;
}

export type SavedPostItem = {
  _id: string;
  postId: string;
  firstUrl?: string;
  like_count?: number;
  save_count?: number;
  photo_length?: number;
  createdAt?: string;
  photoCount?: number;
};

export interface Comment {
  _id: string;
  post_id: string;
  user_id: string;
  content: string;
  like_count: number;
  parent_comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetCommentsResponse {
  code: string;
  data: Comment[];
}

export interface ActionCommentType {
  commentId: string;
}

export interface GetPostsPayload {
  id?: string;
  page?: number;
  pageSize?: number;
}
