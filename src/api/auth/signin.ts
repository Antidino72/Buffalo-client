import type { LoginResult } from "../../types/loginresult.js";
import type { Sign } from "../../types/sign.js";
import { requete } from "../../base/request.js";

export function signin(data: Sign) {
  console.log(data)
  return requete<LoginResult>("/users/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}