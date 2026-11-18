import { signin } from "./api/auth/signin.js";
import { signup } from "./api/auth/signup.js";
import { getPosts } from "./api/posts/get.js";
import { likePost } from "./api/posts/like.js";
import { username,email,password } from "./const.js";
import type { Post } from "./types/post.js";
const responce = signup({
    username,
    email,
    password
})