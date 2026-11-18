import { BASE_URL } from "../const.js";

export async function requete<T>(chemin: string, options: RequestInit = {}): Promise<T> {
  const reponse = await fetch(`${BASE_URL}${chemin}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!reponse.ok) {
    console.log("test")
      const texte = await reponse.text();
    throw new Error(`Erreur API ${reponse.status} : ${texte}`);
  }

  return reponse.json() as Promise<T>;
}