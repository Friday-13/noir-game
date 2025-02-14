import getCookieValue from "./getCookieValue";

const CSRF_TOKEN_NAME = "csrf_access_token";
const CSRF_REFRESH_TOKEN_NAME = "csrf_refresh_token";
const BASE_URL = "http://127.0.0.1:8000";

export default class ServerApi {
  static async login(nameOrEmail: string, password: string) {
    const loginData = {
      email_or_name: nameOrEmail,
      password: password,
    };
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(loginData),
    });
    return response;
  }

  static async register(name: string, email: string, password: string) {
    const registerData = {
      name: name,
      email: email,
      password: password,
    };
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(registerData),
    });
    return response;
  }

  static async refresh() {
    const response = await fetch(`${BASE_URL}/refresh`, {
      method: "POST",
      headers: {
        "x-csrf-token": this.getCsrfRefreshToken(),
        accept: "application/json",
      },
      credentials: "include",
    });
    return response;
  }

  static async getProtected() {
    const response = await fetch(`${BASE_URL}/protected`, {
      method: "GET",
      credentials: "include",
      headers: {
        "x-csrf-token": this.getCsrfToken(),
        accept: "application/json",
      },
    });
    return response;
  }

  static getCsrfToken() {
    const csrfToken = getCookieValue(CSRF_TOKEN_NAME) || "";
    return csrfToken;
  }

  static getCsrfRefreshToken() {
    const csrfToken = getCookieValue(CSRF_REFRESH_TOKEN_NAME) || "";
    return csrfToken;
  }
}
