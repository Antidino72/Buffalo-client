
import type { Post } from "../../types/post.js";
import { requete } from "../../base/request.js";
import "dotenv/config";

export function getPosts(token : string) {
  return requete<Post[]>("/posts/get", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}