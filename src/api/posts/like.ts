
import { token } from "../../const.js";
import type { Post } from "../../types/post.js";
import { requete } from "../request.js";
import 'dotenv/config';


export function likePost(postId: string) {
  const params = new URLSearchParams({ postid: postId });
  return requete<unknown>(`/posts/like?${params.toString()}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}