const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

// Helper function to get auth headers
function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Account endpoints
export async function registerUser(data: { username: string; email: string; password: string }): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/account/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
}

export async function loginUser(login: string, password: string): Promise<Response> {
  const formData = new URLSearchParams();
  formData.append('username', login);
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/account/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });
  return response;
}

export async function getMe(token: string): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/account/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
}

export async function logoutUser(): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/account/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  return response;
}

// Anime endpoints
export async function getAnimeList(): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/anime`, {
    headers: getAuthHeaders(),
  });
  return response;
}

export async function getAnime(id: number): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/anime/${id}`, {
    headers: getAuthHeaders(),
  });
  return response;
}

export async function createAnime(data: {
  title: string;
  description: string;
  year: number;
  episodes: number;
  status: string;
  poster_url: string;
}): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/anime`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  return response;
}

export async function updateAnime(id: number, data: {
  title?: string;
  description?: string;
  year?: number;
  episodes?: number;
  status?: string;
  poster_url?: string;
}): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/anime/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  return response;
}

export async function deleteAnime(id: number): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/anime/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response;
}

// Posts endpoints
export async function getPostsList(): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    headers: getAuthHeaders(),
  });
  return response;
}

export async function getPost(id: number): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    headers: getAuthHeaders(),
  });
  return response;
}

export async function createPost(data: {
  title: string;
  content: string;
}): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  return response;
}

export async function createReview(data: {
  title: string;
  content: string;
  anime_id: number;
  rating: number;
}): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  return response;
}

export async function createFanart(data: {
  title: string;
  content: string;
  anime_id: number;
  image_url: string;
}): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/fanart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  return response;
}

export async function updatePost(id: number, data: {
  title?: string;
  content?: string;
}): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  return response;
}

export async function deletePost(id: number): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response;
}

// Comments endpoints
export async function getComments(postId: number): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    headers: getAuthHeaders(),
  });
  return response;
}

export async function createComment(postId: number, data: { content: string }): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  return response;
}

export async function updateComment(commentId: number, data: { content: string }): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  return response;
}

export async function deleteComment(commentId: number): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response;
}

// Products endpoints
export async function getProducts(category?: string, animeId?: number): Promise<Response> {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (animeId) params.append('anime_id', animeId.toString());

  const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  return response;
}

export async function getProduct(id: number): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    headers: getAuthHeaders(),
  });
  return response;
}

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  stock?: number;
  category: string;
  image_url?: string;
  anime_id?: number;
}): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  return response;
}

export async function updateProduct(id: number, data: {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  image_url?: string;
  anime_id?: number;
  is_active?: boolean;
}): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  return response;
}

export async function deleteProduct(id: number): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response;
}
