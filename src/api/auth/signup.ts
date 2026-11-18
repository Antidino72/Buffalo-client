import type { LoginResult } from "../../types/loginresult.js";
import type { Sign } from "../../types/sign.js";
import { requete } from "../../base/request.js";

export function signup(data: Sign) {
  return requete<LoginResult>("/users/signup", {
    method: "POST",
   
    body: JSON.stringify(data),
  });
}