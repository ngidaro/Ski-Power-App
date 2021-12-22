import { BaseService } from './base.service';
import { AuthenticationService } from './authentication.service';

export abstract class SecuredService extends BaseService {
    constructor() {
        super()
        this.client.interceptors.request.use((config: any) => {
            if (!config.headers["x-access-token"]) {
                config.headers["x-access-token"] = AuthenticationService.getToken();
            }
            return config;
        })
    }
}