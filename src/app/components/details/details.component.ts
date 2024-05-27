import { Component, OnInit } from '@angular/core';
import { Auth } from 'src/app/auth/auth.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { Favourite } from 'src/app/models/favourite.interface';
import { PokemonService } from 'src/app/service/pokemon.service';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
    utente!: Auth | null;
    userNameDetails: string | undefined;
    userSurnameDetails: string | undefined;
    userUsernameDetails: string | undefined;
    userEmailDetails: string | undefined;
    userImageUrl: string | undefined;
    userPokemonCount: number | undefined;
    userDetail: any;
    numFavoriti: number = 0; // Variabile per memorizzare il numero di preferiti
    favoriti: Favourite[] = [];

    constructor(
        private authSrv: AuthService,
        private pokemonService: PokemonService
    ) {}

    //recupero dati dell'utente loggato
    ngOnInit(): void {
        const userDetails = localStorage.getItem('kakUser');

        if (userDetails) {
            const userDataDetails = JSON.parse(userDetails);
            this.userNameDetails = userDataDetails.name;
            this.userEmailDetails = userDataDetails.email;
            this.userSurnameDetails = userDataDetails.surname;
            this.userUsernameDetails = userDataDetails.username;
            this.userImageUrl = userDataDetails.avatarUrl;
            this.getPokemonCount();
        } else {
            console.log('No kakUser data found in local storage');
        }
    }

    getPokemonCount(): void {
        this.userDetail = localStorage.getItem('kakUser');
        const userId = JSON.parse(this.userDetail);
        const id = userId.id;
        const favorito: Favourite = {
            userId: id,
        };

        this.pokemonService
            .recuperaFavoriti(favorito.userId)
            .subscribe((response) => {
                this.favoriti = response;
                this.numFavoriti = this.favoriti.length;
            });
    }
}
