export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly details: unknown;

  constructor(status: number, details: unknown, message?: string) {
    super(message ?? `Request failed with status ${status}.`);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const DEFAULT_API_URL = "http://localhost:8010";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL.replace(/\/$/, "")}${normalizedPath}`;
}

async function parseResponse<TResponse>(response: Response): Promise<TResponse> {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return (await response.json()) as TResponse;
  }

  const text = await response.text();
  return text as TResponse;
}

function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("accessToken");
}

export async function apiClient<TResponse, TBody = unknown>(
  path: string,
  options: ApiRequestOptions<TBody> = {},
): Promise<TResponse> {
  const {
    method = "GET",
    body,
    headers = {},
    credentials = "same-origin",
  } = options;

  const accessToken = getStoredAccessToken();

  const response = await fetch(buildUrl(path), {
    method,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials,
  });

  const payload = await parseResponse<TResponse>(response);

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : `Request failed with status ${response.status}.`;

    throw new ApiError(response.status, payload, message);
  }

  return payload;
}
