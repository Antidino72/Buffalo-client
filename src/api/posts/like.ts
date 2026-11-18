
import { requete } from "../../base/request.js";
import 'dotenv/config';


export function likePost(postId: string,token : string) {
  const params = new URLSearchParams({ postid: postId });
  return requete<unknown>(`/posts/like?${params.toString()}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}
export function unlikePost(postId: string,token : string) {
  const params = new URLSearchParams({ postid: postId });
  return requete<unknown>(`/posts/unlike?${params.toString()}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}