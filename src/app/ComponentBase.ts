import { AuthService } from './auth/auth.service';

export class ComponentBase {

    constructor(protected accountService: AuthService) {}

    get isLogged() {
        return this.accountService.isLogged;
    }
}
