import { baseURL, getToken } from "./config";

export function getImage (id) {
  return `${baseURL}/assets/${id}?access_token=${getToken()}`
}