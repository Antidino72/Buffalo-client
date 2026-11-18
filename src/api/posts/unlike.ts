
import { requete } from "../../base/request.js";
import 'dotenv/config';


export function unlikePost(postId: string,token : string) {
  const params = new URLSearchParams({ postid: postId });
  return requete<unknown>(`/posts/unlike?${params.toString()}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}