// src/modules/http/implementations/AxiosHttpService.ts
import Axios, { AxiosError, AxiosInstance } from "axios";
import { injectable } from "inversify";

import appConfig from "../../../config/appConfig";
import { IHttpService } from "../models/IHttpService";
import AppError from "../../../utils/appError";

@injectable()
export default class AxiosHttpService implements IHttpService {
  private httpInstance: AxiosInstance;

  constructor() {
    this.httpInstance = Axios.create({
      timeout: appConfig.api.timeout,
      baseURL: appConfig.api.url,
    });
  }

  setTokenExpirationStrategy(
    tokenExpireStrategy: () => Promise<string | null>
  ) {
    this.httpInstance.interceptors.request.clear();
    this.httpInstance.interceptors.request.use(async (config) => {
      const newTokenProvided = await tokenExpireStrategy();
      if (newTokenProvided) {
        this.setAuthorization(newTokenProvided);
        config.headers.Authorization = newTokenProvided;
      }
      return config;
    });
  }

  setAuthorization(token: string): void {
    this.httpInstance.defaults.headers.common.Authorization = token;
  }

  getAuthorization(): string {
    return this.httpInstance.defaults.headers.common.Authorization!.toString();
  }

  private async makeRequest<T = any>(
    method: string,
    path: string,
    body?: any,
    params?: {},
    responseType?: string
  ): Promise<T> {
    try {
      const { data } = await this.httpInstance.request<T>({
        method,
        url: path,
        data: body,
        params,
        responseType: responseType as any,
      });
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;

      const message =
        axiosError.response?.data?.message ??
        axiosError.message ??
        "Erro inesperado na requisição.";

      if (axiosError.response?.status === 403) {
        throw new AppError(message, "error");
      }

      if (axiosError.response?.status === 500) {
        throw new AppError(message, "error");
      }

      throw new AppError(message, "error");
    }
  }

  public async get<T>(path: string, params?: any): Promise<T> {
    return await this.httpInstance
      .get<T>(path, params)
      .then(({ data }) => data)
      .catch((err) => {
        const error: AxiosError<{ message: string }> = err;
        if (error.response?.status === 403) {
          //goToLogout();
          throw new AppError("erro 403", "error");
        }
        if ([404, 500].includes(error.response?.status || 0)) {
          throw new AppError(err, "error");
        }
        if (error.response?.data?.message) {
          throw new AppError(error.response.data.message, "error");
        } else {
          throw new AppError("Unable to perform operation", "error");
        }
      });
  }

  async post<T = any>(
    path: string,
    body: any,
    params?: {},
    responseType?: string
  ): Promise<T> {
    return await this.makeRequest<T>("POST", path, body, params, responseType);
  }

  async delete<T = any>(path: string, params?: {}): Promise<T> {
    return await this.makeRequest<T>("DELETE", path, undefined, params);
  }

  async patch<T = any>(path: string, body?: string, params?: {}): Promise<T> {
    return await this.makeRequest<T>("PATCH", path, body, params);
  }

  async put<T = any>(path: string, body?: string, params?: {}): Promise<T> {
    return await this.makeRequest<T>("PUT", path, body, params);
  }
}
