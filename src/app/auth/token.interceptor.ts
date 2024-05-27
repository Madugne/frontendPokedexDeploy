import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    router: any;
    constructor() {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // Get the access token from local storage
        const token = localStorage.getItem('user');
        if (token) {
            const userData = JSON.parse(token);
            const accessToken = userData.accessToken;
            console.log('User ID from local storage:', accessToken);
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        } else {
            //this.router.navigate(['/login']);
            console.log('No user data found in local storage');
        }

        return next.handle(request);
    }
}
