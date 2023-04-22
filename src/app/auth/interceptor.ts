import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: "root",
})
export class AuthInterceptorService implements HttpInterceptor {
    
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authService.isLogged) {
            const clonedRequest = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + this.authService.user.authToken),
            });
            return next.handle(clonedRequest);
        } else {
            return next.handle(req);
        }
    }
}
