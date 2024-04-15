export interface User {
  id: string;
  nickname: string;
  image: string;
  _count: {
    Followers: number,
    Followings: number
  }
}