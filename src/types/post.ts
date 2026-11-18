

export interface Post {
  postid: string;
  category: string;
  user: {
    username: string;
    userid: string;
  };
  content: string;
  likes: number;
  likedByUser: boolean;
}
