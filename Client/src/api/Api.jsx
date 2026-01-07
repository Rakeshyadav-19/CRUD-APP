export async function apiFetch(endpoint, options = {}) {
  const API_BASE_URL =
    import.meta.env.API_BASE_URL || "http://localhost:3000/api";
  const opts = {
    headers: {
      ...(options.headers || {}),
    },
    ...options,
  };
  //   // If body is FormData, remove Content-Type so browser sets it correctly
  //   if (opts.body instanceof FormData) {
  //     delete opts.headers["Content-Type"];
  //     delete opts.headers["content-type"];
  //   }
  const res = await fetch(`${API_BASE_URL}${endpoint}`, opts);

  if (!res.ok) {
    // Try to parse error response as JSON
    let errorData;
    try {
      errorData = await res.json();
    } catch {
      // If not JSON, use text
      errorData = { error: await res.text() };
    }

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
