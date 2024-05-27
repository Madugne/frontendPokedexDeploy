import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/auth/auth.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { PokemonService } from 'src/app/service/pokemon.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    utente!: Auth | null;
    nameUserLogged: string | undefined;
    isLogged = false;
    private userSubscription: Subscription = new Subscription();
    private kakUserSubscription: Subscription = new Subscription();

    constructor(
        private authSrv: AuthService,
        private pokemonService: PokemonService
    ) {}

    ngOnInit(): void {
        this.userSubscription = this.authSrv.user$.subscribe((user) => {
            this.utente = user;
            this.isLogged = !!user;

            if (user) {
                const kakUserDataString = localStorage.getItem('kakUser');
                if (kakUserDataString) {
                    const kakUserData = JSON.parse(kakUserDataString);
                    this.nameUserLogged = kakUserData.name;
                }
            }
        });

        this.kakUserSubscription = this.authSrv.kakUser$.subscribe(
            (kakUser) => {
                if (kakUser) {
                    this.nameUserLogged = kakUser.name;
                }
            }
        );

        // Restore user state from local storage if available
        // this.authSrv.restore();
    }

    logout() {
        this.isLogged = false;
        this.authSrv.logout();
    }

    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
        this.kakUserSubscription.unsubscribe();
    }
}
