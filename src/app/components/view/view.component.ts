import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PokemonService } from 'src/app/service/pokemon.service';

@Component({
    selector: 'app-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
    pokemon: any = null;
    shinyVisible: boolean = false;
    volume: number = 0.5;

    subscriptions: Subscription[] = [];

    constructor(
        private route: ActivatedRoute,
        private pokemonService: PokemonService
    ) {}

    set subscription(subscription: Subscription) {
        this.subscriptions.push(subscription);
    }

    //carica i dettagli del pokemon
    ngOnInit(): void {
        this.subscription = this.route.params.subscribe((params) => {
            if (this.pokemonService.pokemons.length) {
                this.pokemon = this.pokemonService.pokemons.find(
                    (i) => i.name === params['name']
                );
                if (this.pokemon) {
                    this.getEvolution();
                    return;
                }
            }

            this.subscription = this.pokemonService
                .get(params['name'])
                .subscribe(
                    (response) => {
                        this.pokemon = response;
                        this.getEvolution();
                    },
                    (error) => console.log('Error Occurred:', error)
                );
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) =>
            subscription ? subscription.unsubscribe() : 0
        );
    }

    //metodo per ottenere le informazioni sull'evoluzione del pokemon
    getEvolution() {
        if (!this.pokemon.evolutions || !this.pokemon.evolutions.length) {
            this.pokemon.evolutions = [];
            this.subscription = this.pokemonService
                .getSpecies(this.pokemon.name)
                .subscribe((response) => {
                    const id = this.getId(response.evolution_chain.url);
                    this.subscription = this.pokemonService
                        .getEvolution(id)
                        .subscribe((response) =>
                            this.getEvolves(response.chain)
                        );
                });
        }
    }

    //viene chiamato per elaborare la catena di evoluzione di un Pokémon
    getEvolves(chain: any) {
        this.pokemon.evolutions.push({
            id: this.getId(chain.species.url),
            name: chain.species.name,
        });

        if (chain.evolves_to.length) {
            this.getEvolves(chain.evolves_to[0]);
        }
    }

    //viene chiamato per prendere il tipo del pokemon
    getType(pokemon: any): string {
        return this.pokemonService.getType(pokemon);
    }

    //viene utilizzato per estrarre l'ID da una URL
    getId(url: string): number {
        const splitUrl = url.split('/');
        return +splitUrl[splitUrl.length - 2];
    }

    toggleSprite() {
        this.shinyVisible = !this.shinyVisible;
    }

    playPokemonCry() {
        const audio = new Audio(this.pokemon.cries.latest);
        audio.volume = this.volume;
        audio.play();
    }
}
