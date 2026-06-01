export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: { field: string; message: string }[];
};

class FetchError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: { field: string; message: string }[],
  ) {
    super(message);
    this.name = "FetchError";
  }
}

// Handle 401 - logout user
function handle401() {
  // Clear auth tokens
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    // Redirect to login
    if (!window.location.pathname.startsWith("/auth")) {
      window.location.href = "/auth/login?redirected=unauthorized";
    }
  }
}

export interface FetcherOptions extends RequestInit {
  skipRedirectOn401?: boolean;
}

async function fetcher<T>(
  endpoint: string,
  options: FetcherOptions = {},
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;

  const res = await fetch(url, {
    credentials: "include", // send cookies
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  // Handle 401 Unauthorized
  if (res.status === 401) {
    if (!options.skipRedirectOn401) {
      handle401();
    }
    throw new FetchError(401, "Unauthorized. Please login again.");
  }

  const json = (await res.json()) as ApiResponse<T> | ApiError;

  if (!res.ok || !json.success) {
    const err = json as ApiError;
    throw new FetchError(res.status, err.message, err.errors);
  }

  return (json as ApiResponse<T>).data;
}

export const api = {
  get: <T>(endpoint: string, options?: FetcherOptions) =>
    fetcher<T>(endpoint, { method: "GET", ...options }),

  post: <T>(endpoint: string, body: unknown, options?: FetcherOptions) =>
    fetcher<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: FetcherOptions) =>
    fetcher<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    }),

  delete: <T>(endpoint: string, options?: FetcherOptions) =>
    fetcher<T>(endpoint, { method: "DELETE", ...options }),
};

export { FetchError };
