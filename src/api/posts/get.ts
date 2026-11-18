import { token } from "../../const.js";
import type { Post } from "../../types/post.js";
import { requete } from "../request.js";
import "dotenv/config";

export function getPosts() {
  return requete<Post[]>("/posts/get", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}