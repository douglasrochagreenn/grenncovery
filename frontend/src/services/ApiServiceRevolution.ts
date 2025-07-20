/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import router from "@/router";

interface CustomAxiosResponse<T> extends AxiosResponse<T> {
  lastPage?: any;
  currentPage?: any;
  perPage?: any;
  total?: any;
}

interface ApiServiceRevolutionInstance {
  get<T>(
    url: string,
    responseType?: "json" | "blob"
  ): Promise<CustomAxiosResponse<T>>;
  post<T>(url: string, data: any): Promise<CustomAxiosResponse<T>>;
  put<T>(url: string, data: any): Promise<CustomAxiosResponse<T>>;
  delete<T>(url: string): Promise<CustomAxiosResponse<T>>;
}

class ApiServiceRevolution implements ApiServiceRevolutionInstance {
  private static instance: ApiServiceRevolution | null = null;
  private axiosInstance: AxiosInstance;
  private baseURL: string;

  private constructor() {
    this.baseURL = import.meta.env.VITE_APP_BASE_URL_REVOLUTION_API || "";

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
    });

    // Interceptor de resposta
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Redireciona para a página de login caso o erro seja 401
          router.push({ name: "Login" });
        }
        return Promise.reject(error);
      }
    );
  }

  static getInstance(): ApiServiceRevolution {
    if (!ApiServiceRevolution.instance) {
      ApiServiceRevolution.instance = new ApiServiceRevolution();
    }
    return ApiServiceRevolution.instance;
  }

  private handleAxiosError(error: AxiosError): AxiosError {
    if (error.response) {
      console.error("Erro na resposta do servidor:", error.response);
    } else if (error.request) {
      console.error("Sem resposta do servidor:", error.request);
    } else {
      console.error("Erro ao configurar a solicitação:", error.message);
    }
    return error;
  }

  private async request<T>(
    method: string,
    url: string,
    data?: any,
    responseType: "json" | "blob" = "json"
  ): Promise<T> {
    const headers: Record<string, string> = {
      "x-api-key": import.meta.env.VITE_APP_BASE_REVOLUTION_API_KEY || "",
    };

    if (!(data instanceof FormData) && responseType === "json") {
      headers["Content-Type"] = "application/json";
    }

    try {
      const response: AxiosResponse<T> = await this.axiosInstance.request({
        method,
        url,
        data,
        headers,
        responseType,
      });

      return response.data;
    } catch (error) {
      console.error("Request error:", error);
      if (error instanceof Error && "isAxiosError" in error) {
        throw this.handleAxiosError(error as AxiosError);
      } else {
        throw error;
      }
    }
  }

  async get<T>(
    url: string,
    responseType: "json" | "blob" = "json"
  ): Promise<CustomAxiosResponse<T>> {
    if (responseType === "blob") {
      // Para blob, retornar a resposta completa
      const headers: Record<string, string> = {
        "x-api-key": import.meta.env.VITE_APP_BASE_REVOLUTION_API_KEY || "",
      };

      const response: AxiosResponse<T> = await this.axiosInstance.request({
        method: "GET",
        url,
        headers,
        responseType,
      });

      return response as CustomAxiosResponse<T>;
    }

    return this.request("GET", url, undefined, responseType);
  }

  async post<T>(url: string, data: any): Promise<CustomAxiosResponse<T>> {
    return this.request("POST", url, data);
  }

  async put<T>(url: string, data: any): Promise<CustomAxiosResponse<T>> {
    return this.request("PUT", url, data);
  }

  async delete<T>(url: string): Promise<CustomAxiosResponse<T>> {
    return this.request("DELETE", url);
  }
}

export default ApiServiceRevolution.getInstance() as ApiServiceRevolutionInstance;
