
import type { Post } from "../../types/post.js";
import { requete } from "../../base/request.js";
import "dotenv/config";
import type { SendPost } from "../../types/sendPost.js";

export function addPost(data : SendPost,token : string) {
  return requete<Post[]>("/posts/add", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body : JSON.stringify(data)
  });
  
}