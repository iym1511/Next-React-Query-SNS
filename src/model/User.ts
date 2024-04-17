export interface UserID {
  userId: string
}
export interface User {
  Followers : UserID[];
  id: string;
  nickname: string;
  image: string;
  _count: {
    Followers: number;
    Followings: number;
  }
}