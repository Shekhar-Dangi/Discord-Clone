import Cookies from "js-cookie";

export function getTokenFromCookies() {
  return Cookies.get("token");
}
