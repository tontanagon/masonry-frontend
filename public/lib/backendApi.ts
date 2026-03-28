const BACKEND_URL = process.env.BACKEND_API_URL || "http://masonry-backend:8080/api";

export async function fetchFromBackend(endpoint: string, options: RequestInit = {}) {
  const url = `${BACKEND_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch Error on [${url}]:`, error);
    throw error;
  }
}
