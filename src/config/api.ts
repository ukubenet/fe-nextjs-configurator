import { toast } from "react-toastify";

export const API_CONFIG = {
  baseUrl: process.env.API_URL || 'http://localhost:4000',
  endpoints: {
    app: '/v1/api/app/',
    duplicate: '/v1/api/app/duplicate/',
  }
};

export const fetchApi = async (url: string, options: RequestInit = {}): Promise<Response | undefined> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('An unknown error occurred');
    }
    return undefined;
  }
}
