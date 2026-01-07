export async function apiFetch(endpoint, options = {}) {
  const API_BASE_URL =
    import.meta.env.API_BASE_URL || "http://localhost:3000/api";
  const opts = {
    headers: {
      ...(options.headers || {}),
    },
    ...options,
  };
  const res = await fetch(`${API_BASE_URL}${endpoint}`, opts);

  if (!res.ok) {
    let errorData;
    errorData = await res.json();

    // Create error object with response data
    const error = new Error(
      errorData.message || errorData.error || "Request failed"
    );
    error.response = {
      status: res.status,
      data: errorData,
    };
    throw error;
  }

  return res.json();
}
