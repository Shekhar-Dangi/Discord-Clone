import Cookies from "js-cookie";

export function getTokenFromCookies() {
  if (Cookies.get("token")) return Cookies.get("token");
  return "";
}
