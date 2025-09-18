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
