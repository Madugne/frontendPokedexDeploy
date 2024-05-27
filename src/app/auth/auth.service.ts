import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Auth } from './auth.interface';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    baseURL = environment.baseURL;
    utente!: Auth;
    jwtHelper = new JwtHelperService();
    private authSubj = new BehaviorSubject<null | Auth>(null);
    user$ = this.authSubj.asObservable();
    private kakUserSubj = new BehaviorSubject<null | any>(null);
    kakUser$ = this.kakUserSubj.asObservable();
    timeOut: any;

    constructor(private http: HttpClient, private router: Router) {}

    login(data: { email: string; password: string }) {
        return this.http.post<Auth>(`${this.baseURL}auth/login`, data).pipe(
            tap((data) => {
                console.log(data);
                this.authSubj.next(data);
                this.utente = data;
                console.log('resp login', this.utente.id);
                localStorage.setItem('user', JSON.stringify(data));

                // Fetch kakUser details after login
                this.getUserLoggedDetails(data.id).subscribe((resp: any) => {
                    this.kakUserSubj.next(resp);
                    localStorage.setItem('kakUser', JSON.stringify(resp));
                    this.autoLogout(data);
                });
            })
        );
    }

    logout() {
        this.authSubj.next(null);
        this.kakUserSubj.next(null);
        localStorage.removeItem('user');
        localStorage.removeItem('kakUser');
        this.router.navigate(['/login']);
    }

    // Logout automatico alla scadenza del token
    autoLogout(data: Auth) {
        const scadenza = this.jwtHelper.getTokenExpirationDate(
            data.accessToken
        ) as Date;
        const tempoScadenza = scadenza.getTime() - new Date().getTime();
        this.timeOut = setTimeout(() => {
            this.logout();
        }, tempoScadenza);
    }

    // Recupero dell'utente loggato nel local storage
    restore() {
        const utenteLoggato = localStorage.getItem('user');
        if (!utenteLoggato) {
            return;
        }

        const datiUtente: Auth = JSON.parse(utenteLoggato);
        if (this.jwtHelper.isTokenExpired(datiUtente.accessToken)) {
            return;
        }
        this.authSubj.next(datiUtente);

        const kakUserLoggato = localStorage.getItem('kakUser');
        if (kakUserLoggato) {
            this.kakUserSubj.next(JSON.parse(kakUserLoggato));
        }

        this.autoLogout(datiUtente);
    }

    registra(data: { name: string; email: string; password: string }) {
        return this.http.post(`${this.baseURL}auth/register`, data);
    }

    getUserLoggedDetails(id: string) {
        return this.http.get(`${this.baseURL}users/${id}`);
    }
}
