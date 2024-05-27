import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Favourite } from '../models/favourite.interface';
import { AuthService } from '../auth/auth.service';
import { Pokemon } from '../models/pokemon.interface';

@Injectable({
    providedIn: 'root',
})
export class PokemonService {
    private url: string = environment.apiUrl + 'pokemon/';
    private _pokemons: any[] = [];
    private _next: string = '';

    //pokeapiv2
    apiUrl = environment.apiUrl;
    //json server
    baseUrl = environment.baseURL;

    private _favorites: any[] = [];

    constructor(private http: HttpClient, private authSrv: AuthService) {}

    //prende i pokemon dall'api esterna
    get pokemons(): any[] {
        return this._pokemons;
    }

    //accede ai valori delle variabili private all'interno di una classe
    get next(): string {
        return this._next;
    }

    //imposta valori delle variabili private all'interno di una classe
    set next(next: string) {
        this._next = next;
    }

    //prende il tipo del pokemon
    getType(pokemon: any): string {
        return pokemon && pokemon.types.length > 0
            ? pokemon.types[0].type.name
            : '';
    }

    //prende il nome del pokemon
    get(name: string): Observable<any> {
        const url = `${this.url}${name}`;
        return this.http.get<any>(url);
    }

    //prende i dati da un endpoint specificato dall'URL
    getNext(): Observable<any> {
        const url = this.next === '' ? `${this.url}?limit=100` : this.next;
        return this.http.get<any>(url);
    }

    //prende le evoluzioni di un pokemon
    getEvolution(id: number): Observable<any> {
        const url = `${environment.apiUrl}evolution-chain/${id}`;
        return this.http.get<any>(url);
    }

    //prende la specie di un pokemon
    getSpecies(name: string): Observable<any> {
        const url = `${environment.apiUrl}pokemon-species/${name}`;
        return this.http.get<any>(url);
    }

    //recupera i favoriti di un utente
    recuperaFavoriti(userId: number) {
        return this.http.get<Favourite[]>(
            `${this.baseUrl}users/${userId}/pokemon`
        );
    }

    //recupera i pokemon
    recuperaPokemon() {
        return this.http.get<Pokemon[]>(`${this.apiUrl}`);
    }

    //aggiungi un pokemon ai favoriti
    aggiungiFavorito(userId: Favourite, pokemonId: Favourite) {
        return this.http.post(
            `${this.baseUrl}users/${userId}/pokemon/${pokemonId}`,
            {},
            { responseType: 'text' }
        );
    }

    //rimuove un pokemon dai favoriti
    rimuoviFavorito(userId: Favourite, pokemonId: Favourite) {
        return this.http.delete(
            `${this.baseUrl}users/${userId}/pokemon/${pokemonId}`,
            { responseType: 'text' }
        );
    }

    //recupera i dettagli del pokemon corrispondente
    dettaglioPreferito(id: number) {
        return this.http.get<Pokemon>(`${this.apiUrl}pokemon/${id}`);
    }

    searchPokemon(name: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}pokemon/${name}`);
    }
}
