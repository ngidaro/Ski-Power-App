export interface ApiResult<T> {
    data?: T;
    code?: number;
    error?: string;
    success: boolean;
}