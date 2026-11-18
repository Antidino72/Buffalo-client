import type { Sign } from "../../types/sign.js";
import { requete } from "../request.js";

export function signin(data: Sign) {
  console.log(data)
  return requete<{ id: unknown }>("/users/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}