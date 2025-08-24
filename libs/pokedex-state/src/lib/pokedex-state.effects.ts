import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { map, switchMap, catchError, of, withLatestFrom, filter } from 'rxjs';
import * as PokedexStateActions from './pokedex.actions';
import { Apollo, gql } from 'apollo-angular';
import { Store } from '@ngrx/store';
import {
  selectLimit,
  selectLoading,
  selectCount,
  selectQuery,
  selectHasMore,
} from './pokedex-state.selectors';
import { Pokemon } from '@pokedex/types';

const GET_POKEMONS = gql`
  query GetPokemons($limit: Int!, $offset: Int!, $search: String) {
    pokemon(limit: $limit, offset: $offset) {
    name
    id
    pokemontypes {
      type {
        name
      }
    }
    pokemonmoves(limit: 3) {
      move {
        name
      }
    }
    pokemonstats(limit: 5) {
      base_stat
      effort
      stat {
        name
      }
    }
    pokemonsprites {
     sprites
    }
  }
  }
`;

@Injectable()
export class PokedexStateEffects {
  private actions$ = inject(Actions);
  private apollo = inject(Apollo);
  private store = inject(Store);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokedexStateActions.initPokedex),
      withLatestFrom(this.store.select(selectLimit)),
      map(([, limit]) => PokedexStateActions.loadPage({ offset: 0, limit }))
    )
  );

  setQuery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokedexStateActions.setQuery),
      withLatestFrom(this.store.select(selectLimit)),
      map(([, limit]) => PokedexStateActions.loadPage({ offset: 0, limit }))
    )
  );

  loadMore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokedexStateActions.loadMore),
      withLatestFrom(
        this.store.select(selectLoading),
        this.store.select(selectCount),
        this.store.select(selectLimit),
        this.store.select(selectHasMore)
      ),
      filter(([, loading, , , hasMore]) => !loading && hasMore),
      map(([, , count, limit]) =>
        PokedexStateActions.loadPage({ offset: count, limit })
      )
    )
  );

  loadPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PokedexStateActions.loadPage),
      withLatestFrom(this.store.select(selectQuery)),
      switchMap(([{ offset, limit }]) =>
        this.apollo
          .query<{ pokemon: Pokemon[]}>({
            query: GET_POKEMONS,
            variables: { limit, offset },
            fetchPolicy: 'cache-first',
          })
          .pipe(
            map((res) => {
              const items = res.data?.pokemon ?? [];
              const total = items.length < limit ? offset + items.length : undefined;
              return PokedexStateActions.loadPageSuccess({
                items,
                offset,
                limit,
                total,
              });
            }),
            catchError((error) => {
              console.error('Error', error);
              return of(PokedexStateActions.loadPokedexStateFailure({ error }));
            })
          )
      )
    )
  );
}
