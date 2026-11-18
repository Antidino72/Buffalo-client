
import { signin } from "./api/auth/signin.js";
import { signup } from "./api/auth/signup.js";
import { addPost } from "./api/posts/add.js";
import { getPosts } from "./api/posts/get.js";
import { likePost, unlikePost } from "./api/posts/like.js";
import type { LoginResult } from "./types/loginresult.js";
import type { Post } from "./types/post.js";
import type { SendPost } from "./types/sendPost.js";

export class BuffaloClient {
  private token: string | null = null;


  async login(username: string, password: string, email : string): Promise<LoginResult> {
    const reponse = await signin({username,email,password});
    this.token = reponse.token;
    return reponse
  }
  async signup(username :string, password: string,email: string){
    const reponse = await signup({username,password,email})
    this.token = reponse.token;
  }
  getPosts() {
    return getPosts(this.requireToken());
  }
  
  unLikePost(postId : string){
    return unlikePost(postId,this.requireToken())
  }

  likePost(postId: string) {
    return likePost(postId,this.requireToken());
  }
  addPost(post : SendPost) : Promise<Post>{
    return addPost(post,this.requireToken())
  }

  private requireToken(): string {
    if (!this.token) throw new Error("Non connecté : appelle login() d'abord");
    return this.token;
  }
}