import type { Sign } from "../../types/sign.js";
import { requete } from "../request.js";

export function signup(data: Sign) {
  console.log(data)
  return requete<{ id: unknown }>("/users/signup", {
    method: "POST",
   
    body: JSON.stringify(data),
  });
}