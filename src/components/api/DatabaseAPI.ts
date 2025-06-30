import axios, { AxiosResponse, AxiosError } from 'axios';
import { toast } from 'react-toastify';

// 共通エラーレスポンス型
export interface APIError {
    message: string;
    statusCode: number;
    details?: any;
}

// リクエスト・レスポンス型
export interface APIRequest<T = any> {
    endpoint: string;
    data?: T;
    timeout?: number;
    showSuccessToast?: boolean;
    successMessage?: string;
    showErrorToast?: boolean;
    errorMessage?: string;
}

export interface APIResponse<T = any> {
    success: boolean;
    data?: T;
    error?: APIError;
}

// Axiosインスタンスの作成
const DatabaseAPI = axios.create({
    baseURL: 'http://localhost:58000',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000  // 10秒に設定
});

// レスポンスインターセプター（共通エラーハンドリング）
DatabaseAPI.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        const apiError: APIError = {
            message: error.message || 'Unknown error occurred',
            statusCode: error.response?.status || 0,
            details: error.response?.data
        };
        
        console.error('API Error:', apiError);
        return Promise.reject(apiError);
    }
);

// タイムアウト時間を動的に設定する関数
export const setAPITimeout = (timeoutMs: number) => {
    DatabaseAPI.defaults.timeout = timeoutMs;
};

// database_idを自動注入するヘルパー
let currentDatabaseId: string | null = null;

export const setDatabaseId = (databaseId: string) => {
    currentDatabaseId = databaseId;
};

// 高レベルAPI関数
export const apiRequest = async <T = any, R = any>(
    request: APIRequest<T>
): Promise<APIResponse<R>> => {
    try {
        // database_idを自動注入
        const requestData = request.data ? {
            database_id: currentDatabaseId,
            ...request.data
        } : { database_id: currentDatabaseId };

        // カスタムタイムアウトがある場合は一時的に設定
        const originalTimeout = DatabaseAPI.defaults.timeout;
        if (request.timeout) {
            DatabaseAPI.defaults.timeout = request.timeout;
        }

        const response = await DatabaseAPI.post(request.endpoint, requestData);

        // タイムアウトを元に戻す
        if (request.timeout) {
            DatabaseAPI.defaults.timeout = originalTimeout;
        }

        // ステータスチェック
        if (response.status !== 200) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // 成功時のトースト
        if (request.showSuccessToast !== false) {
            const message = request.successMessage || '処理が完了しました';
            toast.success(message);
        }

        return {
            success: true,
            data: response.data
        };

    } catch (error: any) {
        const apiError: APIError = {
            message: error.message || 'Unknown error occurred',
            statusCode: error.response?.status || 0,
            details: error.response?.data
        };

        // エラー時のトースト
        if (request.showErrorToast !== false) {
            const message = request.errorMessage || `処理に失敗しました: ${apiError.message}`;
            toast.error(message);
        }

        return {
            success: false,
            error: apiError
        };
    }
};

// 便利な関数群
export const apiGet = <R = any>(
    endpoint: string, 
    options?: Partial<APIRequest>
): Promise<APIResponse<R>> => {
    return apiRequest<undefined, R>({ endpoint, ...options });
};

export const apiPost = <T = any, R = any>(
    endpoint: string, 
    data: T, 
    options?: Partial<APIRequest>
): Promise<APIResponse<R>> => {
    return apiRequest<T, R>({ endpoint, data, ...options });
};

export const apiDelete = <T = any, R = any>(
    endpoint: string, 
    data: T, 
    options?: Partial<APIRequest>
): Promise<APIResponse<R>> => {
    return apiRequest<T, R>({ endpoint, data, ...options });
};

// データ変換ユーティリティ
export class DataTransformer {
    static colorToString(color: any): string {
        return color?.toString() || '';
    }

    static stringToColor(colorStr: string, ColorClass: any): any {
        return new ColorClass(colorStr);
    }

    static dateToString(date: any): string {
        return date?.toString() || '';
    }

    static stringToDate(dateStr: string, DateClass: any): any {
        return DateClass.fromString(dateStr);
    }

    static timeToString(time: any): string {
        return time?.toString() || '';
    }

    static stringToTime(timeStr: string, TimeClass: any): any {
        return TimeClass.fromString(timeStr);
    }
}

export default DatabaseAPI;