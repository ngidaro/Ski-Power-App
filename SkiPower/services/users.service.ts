import { ApiResult } from "./api-result";
import { SecuredService } from "./secured.service";

export class UserService extends SecuredService {

    private baseUrl = 'api/users';

    public getUser(): Promise<ApiResult<any>> {
      return this.get(`${this.baseUrl}/`);
    }
}