import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { ApiResult } from './api-result';

// export const SERVER_URL: string = 'http://10.0.0.233:3333';
export const SERVER_URL: string = 'http://3.229.46.116';

export abstract class BaseService {

    public static serverURl: string = SERVER_URL;
    protected client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: BaseService.serverURl,
        })
        this.client.interceptors.request.use((config) => this.setHeaders(config));
    }

    protected async get<T>(url: string): Promise<ApiResult<T>> {
        const req = this.client.get<T>(url);
        return this.wrap(url, req);
    }

    protected async put<T>(url: string, data?: any): Promise<ApiResult<T>> {
        const req = this.client.put<T>(url, data);
        return this.wrap(url, req);
    }

    protected async post<T>(url: string, data?: any): Promise<ApiResult<T>> {
        const req = this.client.post<T>(url, data);
        return this.wrap(url, req);
    }

    protected async delete<T>(url: string): Promise<ApiResult<T>> {
        const req = this.client.delete<T>(url);
        return this.wrap(url, req);
    }

    private async wrap<T>(url: string, call: Promise<AxiosResponse<T>>): Promise<ApiResult<T>> {
        try {
            const res = await call;
            var success = true;
            if (!res) {
                throw new Error("Unexpected error");
            }
            if (res.status === 203) {
                // invalid token
                success = false;
            }
            return { data: res.data, success, code: res.status };
        }
        catch (err: any) {
          const response = err.response;
          const data = response && response.data;
          const status = response && response.status;
          return { success: false, error: data?.message ?? data?.error, code: status };
        }
    }

    protected setHeaders(config: AxiosRequestConfig | any): AxiosRequestConfig {
      config.headers["Content-Type"] = "application/json";
      return config;
    }
}