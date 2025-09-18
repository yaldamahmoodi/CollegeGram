import api from "../axios";
import {POST_URLS} from "./urls";
import type {CreateLikePostPayload, CreatePostPayload, CreateUnLikePostPayload} from "@app-types/post";


export interface postData {
    "_id": string,
    "user_id": string,
    "urls": string[],
    "caption": string,
    "like_count": number,
    "save_count": number,
    "mentions": string[],
    "hashtag_array": string[],
    "photo_length": number,
    createdAt: string,
}

export type postDataType = postData[];


export const getPosts = async (): Promise<postDataType> => {
    const {data} = await api.get(`/posts/getPosts`);
    return data.data;
};

export const createPost = async (payload: CreatePostPayload) => {
    const {photos, caption} = payload;
    const formData = new FormData();
    photos.forEach((photo) => {
        formData.append("photos", photo);
    });
    if (caption) {
        formData.append("caption", caption);
    }
    const {data} = await api.post(POST_URLS.CREATE_POST, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
};


export const likePost = async (payload: CreateLikePostPayload) => {
    return  await api.post(POST_URLS.LIKE_POST, payload);

}


export const unLikePost = async (payload: CreateUnLikePostPayload) => {
    const {postId} = payload;
   return await api.post(`/posts/${postId}/unlike`)

}