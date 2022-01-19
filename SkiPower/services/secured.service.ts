import { BaseService } from './base.service';
import { AuthenticationService } from './authentication.service';

export abstract class SecuredService extends BaseService {
    constructor() {
        super()
        this.client.interceptors.request.use((config: any) => {
            if (!config.headers["x-access-token"]) {
                return AuthenticationService.getToken().then((token) => {
                  config.headers["x-access-token"] = token;
                  return config;
                });
            }
            return config;
        })
    }
}