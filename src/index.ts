import { signin } from "./api/auth/signin.js";
import { addPost } from "./api/posts/add.js";
import { username,email,password } from "./const.js";
import type { Post } from "./types/post.js";
import type { SendPost } from "./types/sendPost.js";
const responce = await signin({
    username,
    email,
    password
})
console.log(responce)
const token = responce.token


const post : SendPost = {
    user: {
        userid: "",
        username : "Antidino"
    },
    content : "Hello i'm testing your api "

}
const post_responce = await addPost(post,token)
console.log(post_responce)