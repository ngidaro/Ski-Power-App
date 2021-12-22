import { BaseService } from "./base.service";
import { ApiResult } from "./api-result";
import AsyncStorageLib from "@react-native-async-storage/async-storage";

export class AuthenticationService extends BaseService {

    private baseUrl = 'api/users';

    public login(email: string, password: string): Promise<ApiResult<any>> {
        return this.post(`${this.baseUrl}/login`, { email, password });
    }

    public createAccount(firstname: string, lastname: string, email: string, password: string): Promise<ApiResult<any>> {
        return this.post(`${this.baseUrl}/createaccount`, { firstname, lastname, email, password });
    }

    private static token: string | undefined = undefined;

    public static async getToken(): Promise<string | null> {
        var userToken = null;
        await AsyncStorageLib.getItem('currentUser').then((token) => userToken = token);
        return userToken;
    }

    public static saveToken(token: string) {
        AsyncStorageLib.setItem('currentUser', token);
        this.token = token;
    }

    public static clearToken() {
        AsyncStorageLib.setItem('currentUser', '');
        this.token = undefined;
    }
}