const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default class Xhr {
  static async request(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });

    return response;
  }

  static async get(path) {
    return Xhr.request(path, { method: "GET" });
  }

  static async post(path, body) {
    return Xhr.request(path, {
      method: "POST",
      body: JSON.stringify(body)
    });
  }
}
