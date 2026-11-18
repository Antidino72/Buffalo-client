
export interface SendPost {
  category?: string;
  user: {
    username: string;
    userid: string;
  };
  content: string;
}
