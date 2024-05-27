import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    RouterStateSnapshot,
    Router,
    UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authSrv: AuthService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        return this.authSrv.user$.pipe(
            take(1),
            map((utente) => {
                if (utente) {
                    return true;
                }
                alert(
                    'To view this content you need to be logged in!\nLogin or Register'
                );
                return this.router.createUrlTree(['login']);
            })
        );
    }
}
