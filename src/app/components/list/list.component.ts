import { Component, OnDestroy, OnInit } from '@angular/core';
import { concat, Subscription } from 'rxjs';
import { PokemonService } from 'src/app/service/pokemon.service';
import { Router } from '@angular/router';
import { Favourite } from 'src/app/models/favourite.interface';
import { Pokemon } from 'src/app/models/pokemon.interface';
import { Auth } from 'src/app/auth/auth.interface';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
    loading: boolean = false;
    subscriptions: Subscription[] = [];
    utente!: Auth | any;
    favoriti: Favourite[] = [];
    userDetail: any;
    term = '';
    pokemonName: string = '';
    pokemonData: any;
    nameUserLogged: string | undefined;
    isLogged = false;
    pokemonNotFoundMessage = false;
    private userSubscription: Subscription = new Subscription();
    private kakUserSubscription: Subscription = new Subscription();

    constructor(
        private pokemonService: PokemonService,
        private router: Router,
        private authSrv: AuthService
    ) {
        this.utente = localStorage.getItem('user');
        this.utente = JSON.parse(this.utente);
    }

    get pokemons(): any[] {
        return this.pokemonService.pokemons;
    }

    set subscription(subscription: Subscription) {
        this.subscriptions.push(subscription);
    }

    ngOnInit(): void {
        this.loadPokemons(true);
        this.recuperaFavouritiList();
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
        this.authSrv.restore();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) =>
            subscription ? subscription.unsubscribe() : 0
        );
    }

    loadPokemons(initialLoad: boolean = false): void {
        this.loading = true;
        this.subscription = this.pokemonService.getNext().subscribe(
            (response) => {
                this.pokemonService.next = response.next;
                const details = response.results.map((i: any) =>
                    this.pokemonService.get(i.name)
                );
                this.subscription = concat(...details).subscribe(
                    (response: any) => {
                        this.pokemonService.pokemons.push(response);
                    }
                );
            },
            (error) => console.log('Error Occurred:', error),
            () => (this.loading = false)
        );
    }

    loadMore(): void {
        this.loadPokemons();
    }

    getType(pokemon: any): string {
        return this.pokemonService.getType(pokemon);
    }

    aggiungiFavorito(idPokemon: number): void {
        this.userDetail = localStorage.getItem('kakUser');
        const userId = JSON.parse(this.userDetail);
        const id = userId.id;
        const favorito: Favourite = {
            userId: id,
            pokemonId: idPokemon,
        };

        this.pokemonService
            .aggiungiFavorito(favorito.userId, favorito.pokemonId)
            .subscribe(() => {
                this.pokemonService
                    .recuperaFavoriti(favorito.userId)
                    .subscribe((response) => {
                        this.favoriti = response;
                        console.log('donatenn', response);
                    });
                console.log('ho aggiunto un nuovo pokemon');
            });
    }

    eliminaFavorito(idPokemon: number): void {
        this.userDetail = localStorage.getItem('kakUser');
        const userId = JSON.parse(this.userDetail);
        const id = userId.id;
        const favorito: Favourite = {
            userId: id,
            pokemonId: idPokemon,
        };

        this.pokemonService
            .rimuoviFavorito(favorito.userId, favorito.pokemonId)
            .subscribe(() => {
                this.pokemonService
                    .recuperaFavoriti(favorito.userId)
                    .subscribe((response) => {
                        this.favoriti = response;
                        console.log('donatenn', response);
                    });
                console.log('ho rimosso un pokemon');
            });
    }

    isFavorito(pokemon: Pokemon): boolean {
        return this.favoriti.includes(pokemon.id);
    }

    getIdFavorito(pokemon: Pokemon): number | undefined {
        const favorito = this.favoriti.find((f) => f.pokemonId === pokemon.id);
        return favorito?.id;
    }

    search(): void {
        if (this.pokemonName) {
            this.pokemonService
                .searchPokemon(this.pokemonName.toLowerCase())
                .subscribe(
                    (data) => {
                        this.pokemonNotFoundMessage = false;
                        this.pokemonData = data;
                    },
                    (error) => {
                        this.pokemonNotFoundMessage = true;
                        console.error('Pokemon not found', error);
                        // window.alert('Pokemon not found');
                    }
                );
        } else {
            this.pokemonNotFoundMessage = false;
            this.pokemonData = null;
        }
    }

    recuperaFavouritiList(): void {
        this.userDetail = localStorage.getItem('kakUser');
        const userId = JSON.parse(this.userDetail).id;

        this.pokemonService.recuperaFavoriti(userId).subscribe(
            (response) => {
                this.favoriti = response;
                console.log('Favourites loaded', response);
            },
            (error) => console.error('Error loading favourites:', error)
        );
    }

    scrollTo() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
