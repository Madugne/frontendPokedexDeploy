import { Component, OnInit } from '@angular/core';
import { Favourite } from 'src/app/models/favourite.interface';
import { Auth } from 'src/app/auth/auth.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { PokemonService } from 'src/app/service/pokemon.service';
import { Pokemon } from 'src/app/models/pokemon.interface';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
    user: Auth | null = null;
    pokemon: Pokemon[] = [];
    userId!: number;
    preferiti: Favourite[] = [];
    userDetail: any;
    favoriti: Favourite[] = [];

    constructor(
        private pokemonService: PokemonService,
        private authSrv: AuthService
    ) {
        //recupera i favoriti dell'utente attraverso il suo user id e lo manda in stampa
    }

    get pokemons(): any[] {
        console.log('pokemona', this.pokemon);
        return this.pokemonService.pokemons;
    }

    ngOnInit(): void {
        this.recuperaFavorito();
    }

    recuperaFavorito(): void {
        this.userDetail = localStorage.getItem('kakUser');
        const userId = JSON.parse(this.userDetail); //fa il parsing del kakuser
        const id = userId.id;
        const favorito: Favourite = {
            userId: id, //prendiamo id utente da local storage
        };

        this.pokemonService
            .recuperaFavoriti(favorito.userId)
            .subscribe((response) => {
                this.favoriti = response;
                this.stampaPreferiti();
                console.log(
                    'sono nella lista dei pokemon preferiti ed ho fatto la chiamata recuperaFavoriti',
                    response
                );
            });
    }

    //stampa i pokemon preferiti attraverso l'id
    stampaPreferiti() {
        this.pokemon = []; // Svuota l'array pokemon prima di aggiungere i nuovi pokemon
        this.favoriti.forEach((pok: any) => {
            if (pok) {
                this.pokemonService
                    .dettaglioPreferito(pok)
                    .subscribe((stampa) => {
                        this.pokemon.push(stampa);
                    });
            }
        });
    }

    rimuoviPokemon(idPokemon: number) {
        console.log('pokemon rimosso con id:', idPokemon);
        this.userDetail = localStorage.getItem('kakUser');
        const userId = JSON.parse(this.userDetail); //fa il parsing del kakuser
        const id = userId.id;
        const favorito: Favourite = {
            userId: id, //prendiamo id utente da local storage
            pokemonId: idPokemon,
        };
        this.pokemonService
            .rimuoviFavorito(favorito.userId, favorito.pokemonId)
            .subscribe((resp: any) => {
                console.log('ho rimosso pokemon');
                // Dopo aver rimosso il pokemon, aggiorna la lista dei preferiti nel componente
                this.recuperaFavorito();
            });
    }
}
