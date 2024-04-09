import { User } from "./User";
import {PostImage} from "@/model/PostImage";

export interface UserID {
  userId: string
}


export interface Post {
  postId: number;
  User: User;
  content: string;
  createdAt: Date;
  Images: PostImage[];
  Hearts: UserID[];
  Reposts: UserID[];
  Comments: UserID[];
  _count: {
    Hearts: number,
    Repost: number,
    Comments: number,
  }
}