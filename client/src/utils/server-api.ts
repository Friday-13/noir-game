import getCookieValue from "./getCookieValue";

const CSRF_TOKEN_NAME = "csrf_access_token";
const BASE_URL = "http://127.0.0.1:8000";

export default class ServerApi {
  static async login(nameOrEmail: string, password: string) {
    const loginData = {
      email_or_name: nameOrEmail,
      password: password,
    };
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginData),
      });
      if (!response.ok) throw new Error("Form error");
    } catch (error) {
      console.error(error);
    }
  }

  static async getProtected() {
    try {
      const response = await fetch(`${BASE_URL}/protected`, {
        method: "GET",
        credentials: "include",
        headers: {
          "x-csrf-token": this.getCsrfToken(),
          accept: "application/json",
        },
      });
      if (!response.ok) throw new Error("Form error");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  static getCsrfToken() {
    const csrfToken = getCookieValue(CSRF_TOKEN_NAME) || "";
    return csrfToken;
  }
}
