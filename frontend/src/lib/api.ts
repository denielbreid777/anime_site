const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

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
